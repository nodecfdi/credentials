import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { readPfxFile } from '../../../src/node';
import { invokeCli } from '../../../test_helpers/cli_test_helper';
import { utilities } from '../../../test_helpers/test_utilities';

describe('cli pfx export', () => {
  const csdCer = utilities.filePath('CSD01_AAA010101AAA/certificate.cer');
  const csdKey = utilities.filePath('CSD01_AAA010101AAA/private_key.key');
  const csdPassFile = utilities.filePath('CSD01_AAA010101AAA/password.txt');
  const csdPass = utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim();

  let workDir = '';

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'nc-credentials-pfx-'));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  test('exports credential to PFX file reusing private key password', async () => {
    const outPfx = path.join(workDir, 'exported.pfx');

    const result = await invokeCli([
      'pfx',
      'export',
      '--cer',
      csdCer,
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--output',
      outPfx,
    ]);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(existsSync(outPfx)).toBeTruthy();

    const loaded = readPfxFile(outPfx, csdPass);
    expect(loaded.rfc()).toBe('AAA010101AAA');
  });

  test('exports credential with custom --pfx-password and --algorithm aes256', async () => {
    const outPfx = path.join(workDir, 'custom.pfx');

    const result = await invokeCli([
      'pfx',
      'export',
      '--cer',
      csdCer,
      '--key',
      csdKey,
      '--password',
      csdPass,
      '--pfx-password',
      'otra-clave-segura',
      '--algorithm',
      'aes256',
      '--output',
      outPfx,
    ]);

    expect(result.code).toBe(0);
    const loaded = readPfxFile(outPfx, 'otra-clave-segura');
    expect(loaded.legalName()).toBe('ACCEM SERVICIOS EMPRESARIALES SC');
  });

  test('fails when required options are missing or algorithm is invalid', async () => {
    const missingOut = await invokeCli([
      'pfx',
      'export',
      '--cer',
      csdCer,
      '--key',
      csdKey,
    ]);
    expect(missingOut.code).toBe(2);
    expect(missingOut.stderr).toContain('--output');

    const badAlgo = await invokeCli([
      'pfx',
      'export',
      '--cer',
      csdCer,
      '--key',
      csdKey,
      '--password',
      csdPass,
      '--output',
      path.join(workDir, 'bad.pfx'),
      '--algorithm',
      'rc4',
    ]);
    expect(badAlgo.code).toBe(2);
    expect(badAlgo.stderr).toContain('Valor no esperado para --algorithm: "rc4"');
  });
});
