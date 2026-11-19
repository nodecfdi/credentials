import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { invokeCli } from '../../../test_helpers/cli_test_helper';
import { utilities } from '../../../test_helpers/test_utilities';

describe('cli sign and verify', () => {
  const csdCer = utilities.filePath('CSD01_AAA010101AAA/certificate.cer');
  const csdKey = utilities.filePath('CSD01_AAA010101AAA/private_key.key');
  const csdPubKey = utilities.filePath('CSD01_AAA010101AAA/public_key.pem');
  const csdPassFile = utilities.filePath('CSD01_AAA010101AAA/password.txt');
  const pfxUnprotected = utilities.filePath('CSD01_AAA010101AAA/credential_unprotected.pfx');
  const fielCer = utilities.filePath('FIEL_AAA010101AAA/certificate.cer');

  let workDir = '';

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'nc-credentials-cli-'));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  test('signs data and verifies signature using base64 encoding', async () => {
    const signResult = await invokeCli([
      'sign',
      '--cer',
      csdCer,
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--data',
      'cadena original de prueba',
    ]);

    expect(signResult.code).toBe(0);
    const signature = signResult.stdout.trim();
    expect(signature.length).toBeGreaterThan(0);

    const verifyResult = await invokeCli([
      'verify',
      '--cer',
      csdCer,
      '--data',
      'cadena original de prueba',
      '--signature',
      signature,
    ]);

    expect(verifyResult.code).toBe(0);
    expect(verifyResult.stdout.trim()).toBe('Firma válida');
  });

  test('signs from stdin with key only and hex encoding, verifies with public key', async () => {
    const signResult = await invokeCli(
      [
        'sign',
        '--key',
        csdKey,
        '--password-file',
        csdPassFile,
        '--algorithm',
        'sha1',
        '--encoding',
        'hex',
      ],
      { stdin: 'datos desde stdin' },
    );

    expect(signResult.code).toBe(0);
    const hexSignature = signResult.stdout.trim();
    expect(hexSignature).toMatch(/^[\da-f]+$/i);

    const verifyResult = await invokeCli(
      [
        'verify',
        '--public-key',
        csdPubKey,
        '--algorithm',
        'sha1',
        '--encoding',
        'hex',
        '--signature',
        hexSignature,
      ],
      { stdin: 'datos desde stdin' },
    );

    expect(verifyResult.code).toBe(0);
    expect(verifyResult.stdout.trim()).toBe('Firma válida');
  });

  test('signs file to output file and verifies using --file and --signature-file with pfx', async () => {
    const inputFile = path.join(workDir, 'documento.txt');
    const sigFile = path.join(workDir, 'firma.b64');
    writeFileSync(inputFile, 'contenido del archivo', 'utf8');

    const signResult = await invokeCli([
      'sign',
      '--pfx',
      pfxUnprotected,
      '--file',
      inputFile,
      '--output',
      sigFile,
    ]);

    expect(signResult.code).toBe(0);
    expect(readFileSync(sigFile, 'utf8').length).toBeGreaterThan(0);

    const verifyResult = await invokeCli([
      'verify',
      '--pfx',
      pfxUnprotected,
      '--file',
      inputFile,
      '--signature-file',
      sigFile,
    ]);

    expect(verifyResult.code).toBe(0);
    expect(verifyResult.stdout.trim()).toBe('Firma válida');
  });

  test('returns exit code 1 when signature does not match or certificate differs', async () => {
    const signResult = await invokeCli([
      'sign',
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--data',
      'mensaje original',
    ]);

    const invalidData = await invokeCli([
      'verify',
      '--cer',
      csdCer,
      '--data',
      'mensaje alterado',
      '--signature',
      signResult.stdout.trim(),
    ]);
    expect(invalidData.code).toBe(1);
    expect(invalidData.stdout.trim()).toBe('Firma inválida');

    const wrongCertQuiet = await invokeCli([
      'verify',
      '--cer',
      fielCer,
      '--data',
      'mensaje original',
      '--signature',
      signResult.stdout.trim(),
      '--quiet',
    ]);
    expect(wrongCertQuiet.code).toBe(1);
    expect(wrongCertQuiet.stdout).toBe('');
  });

  test('fails on invalid algorithm or encoding', async () => {
    const badAlgo = await invokeCli([
      'sign',
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--data',
      'abc',
      '--algorithm',
      'sha999',
    ]);
    expect(badAlgo.code).toBe(2);
    expect(badAlgo.stderr).toContain('Valor no esperado para --algorithm: "sha999"');

    const badEncoding = await invokeCli([
      'sign',
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--data',
      'abc',
      '--encoding',
      'utf32',
    ]);
    expect(badEncoding.code).toBe(2);
    expect(badEncoding.stderr).toContain('Valor no esperado para --encoding: "utf32"');
  });
});
