import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { invokeCli } from '../../../test_helpers/cli_test_helper';
import { utilities } from '../../../test_helpers/test_utilities';

describe('cli argument validation', () => {
  const csdCer = utilities.filePath('CSD01_AAA010101AAA/certificate.cer');
  const csdKey = utilities.filePath('CSD01_AAA010101AAA/private_key.key');
  const csdPassFile = utilities.filePath('CSD01_AAA010101AAA/password.txt');
  const csdPass = utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim();
  const pfxProtected = utilities.filePath('CSD01_AAA010101AAA/credential_protected.pfx');

  let workDir = '';

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'nc-credentials-validation-'));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  test.each([
    [['data', '--cer', csdCer, '--bogus'], 'Opción desconocida: "--bogus"'],
    [['data', '--cer', csdCer, 'sobrante'], 'Argumento inesperado: "sobrante"'],
    [['data', '--cer', csdCer, '--cer', csdCer], 'La opción "--cer" se indicó más de una vez'],
    [['data', '--cer', ''], 'La opción "--cer" no puede estar vacía'],
    [['data', '--cer'], 'Valor faltante o inválido para la opción'],
    [['data', '--cer', csdCer, '--json=si'], 'Valor faltante o inválido para la opción'],
    [['data', '--cer', csdCer, '--pfx', pfxProtected], 'Las opciones --cer y --pfx no pueden usarse al mismo tiempo'],
    [['data', '--cer', csdCer, '--password', 'x'], 'La opción "--password" solo aplica con --pfx'],
    [['data', '--pfx', pfxProtected, '--password', 'x', '--password-file', csdPassFile], '--password y --password-file'],
    [['data', '--cer', csdCer, '--field', 'RFC'], 'Valor no esperado para --field: "RFC"'],
    [['sign', '--pfx', pfxProtected, '--key', csdKey, '--data', 'x'], 'La opción "--key" no puede combinarse con --pfx'],
    [['sign', '--key', csdKey, '--data', 'x', '--file', csdCer], '--data y --file'],
    [['sign', '--key', csdKey, '--password', csdPass, '--data', 'x', '--encoding', 'binary'], 'requiere --output'],
    [['sign', '--key', csdKey, '--password', csdPass, '--data', 'x', '--force'], '--force solo aplica junto con --output'],
    [['sign', '--key', csdKey, '--password', csdPass, '--data', ''], 'La opción "--data" no puede estar vacía'],
    [['verify', '--cer', csdCer, '--data', 'x'], 'Debes especificar --signature'],
    [['verify', '--cer', csdCer, '--public-key', csdCer, '--data', 'x', '--signature', 'AA=='], '--cer y --public-key'],
    [['verify', '--cer', csdCer, '--data', 'x', '--signature', 'no es base64!'], 'La firma no es base64 válida'],
    [['verify', '--cer', csdCer, '--data', 'x', '--signature', 'abc', '--encoding', 'hex'], 'La firma no es hexadecimal válida'],
    [['verify', '--cer', csdCer, '--data', 'x', '--signature', 'AA==', '--encoding', 'binary'], 'requiere --signature-file'],
    [['pfx'], undefined],
    [['pfx', 'importar'], 'Subcomando desconocido para pfx: "importar"'],
    [['--version', 'extra'], 'Argumento inesperado: "extra"'],
    [['constructor'], 'Comando desconocido: "constructor"'],
  ])('rejects unexpected arguments %j', async (argv, message) => {
    const result = await invokeCli(argv);

    if (message === undefined) {
      expect(result.code).toBe(0);

      return;
    }

    expect(result.code).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(message);
  });

  test('warns when password is passed on the command line', async () => {
    const result = await invokeCli(['sign', '--key', csdKey, '--password', csdPass, '--data', 'x']);

    expect(result.code).toBe(0);
    expect(result.stderr).toContain('Advertencia: --password expone la contraseña');
  });

  test('reports operational errors with exit code 1', async () => {
    const result = await invokeCli(['data', '--cer', path.join(workDir, 'no-existe.cer')]);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error:');
  });

  test('refuses to overwrite output files unless --force is used', async () => {
    const output = path.join(workDir, 'firma.b64');
    const args = ['sign', '--key', csdKey, '--password-file', csdPassFile, '--data', 'x', '--output', output];

    const first = await invokeCli(args);
    const second = await invokeCli(args);

    const forced = await invokeCli([...args, '--force']);

    expect(first.code).toBe(0);
    expect(second.code).toBe(2);
    expect(second.stderr).toContain('El archivo de salida ya existe');
    expect(forced.code).toBe(0);
  });

  test('writes output files with restrictive permissions', async () => {
    const output = path.join(workDir, 'salida.pfx');
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
      output,
    ]);

    expect(result.code).toBe(0);
    expect(statSync(output).mode & 0o777).toBe(0o600);
  });

  test('rejects empty input data and oversized or non-regular input files', async () => {
    const empty = path.join(workDir, 'vacio.txt');
    writeFileSync(empty, '');

    const emptyResult = await invokeCli(['sign', '--key', csdKey, '--password-file', csdPassFile, '--file', empty]);
    expect(emptyResult.code).toBe(2);
    expect(emptyResult.stderr).toContain('Los datos de entrada están vacíos');

    const directory = await invokeCli(['sign', '--key', csdKey, '--password-file', csdPassFile, '--file', workDir]);
    expect(directory.code).toBe(2);
    expect(directory.stderr).toContain('no es un archivo regular');

    const stdinEmpty = await invokeCli(['sign', '--key', csdKey, '--password-file', csdPassFile], { stdin: '' });
    expect(stdinEmpty.code).toBe(2);
  });

  test('signs exact bytes: UTF-8 text from --data matches the same bytes from a file', async () => {
    const file = path.join(workDir, 'acentos.txt');
    writeFileSync(file, 'Razón social ñ ✓', 'utf8');
    const base = ['--key', csdKey, '--password-file', csdPassFile];

    const fromData = await invokeCli(['sign', ...base, '--data', 'Razón social ñ ✓']);
    const fromFile = await invokeCli(['sign', ...base, '--file', file]);

    expect(fromData.code).toBe(0);
    expect(fromData.stdout).toBe(fromFile.stdout);

    const verify = await invokeCli([
      'verify',
      '--cer',
      csdCer,
      '--file',
      file,
      '--signature',
      fromData.stdout.trim(),
    ]);
    expect(verify.stdout.trim()).toBe('Firma válida');
  });

  test('signs and verifies binary files with binary signature files', async () => {
    const input = path.join(workDir, 'datos.bin');
    const signatureFile = path.join(workDir, 'firma.bin');
    writeFileSync(input, Uint8Array.from([0, 1, 2, 250, 251, 252, 255]));

    const sign = await invokeCli([
      'sign',
      '--key',
      csdKey,
      '--password-file',
      csdPassFile,
      '--file',
      input,
      '--encoding',
      'binary',
      '--output',
      signatureFile,
    ]);
    expect(sign.code).toBe(0);
    expect(existsSync(signatureFile)).toBeTruthy();
    expect(readFileSync(signatureFile).length).toBe(256);

    const verify = await invokeCli([
      'verify',
      '--cer',
      csdCer,
      '--file',
      input,
      '--signature-file',
      signatureFile,
      '--encoding',
      'binary',
    ]);
    expect(verify.code).toBe(0);
    expect(verify.stdout.trim()).toBe('Firma válida');
  });

  test('treats structurally incompatible signatures as invalid instead of crashing', async () => {
    const result = await invokeCli(['verify', '--cer', csdCer, '--data', 'x', '--signature', 'AAAA']);

    expect(result.code).toBe(1);
    expect(result.stdout.trim()).toBe('Firma inválida');
  });
});
