import { describe, expect, test } from 'vitest';
import { utilities } from '../../test_utilities';
import { invokeCli } from './cli_test_helper';

describe('cli data', () => {
  const fielCer = utilities.filePath('FIEL_AAA010101AAA/certificate.cer');
  const csdCer = utilities.filePath('CSD01_AAA010101AAA/certificate.cer');
  const pfxProtected = utilities.filePath('CSD01_AAA010101AAA/credential_protected.pfx');
  const pfxPassword = utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim();

  test('prints human-readable data from FIEL certificate', async () => {
    const result = await invokeCli(['data', '--cer', fielCer]);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('RFC:              AAA010101AAA');
    expect(result.stdout).toContain('Tipo:             FIEL');
    expect(result.stdout).toContain('Sucursal (OU):    (ninguna)');
  });

  test('supports info alias and --json output for CSD certificate', async () => {
    const result = await invokeCli(['info', '--cer', csdCer, '--json']);

    expect(result.code).toBe(0);
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>;
    expect(parsed.rfc).toBe('AAA010101AAA');
    expect(parsed.legalName).toBe('ACCEM SERVICIOS EMPRESARIALES SC');
    expect(parsed.type).toBe('CSD');
    expect(parsed.serialNumber).toBe('30001000000300023708');
  });

  test.each([
    ['rfc', 'AAA010101AAA'],
    ['legal-name', 'ACCEM SERVICIOS EMPRESARIALES SC'],
    ['legalName', 'ACCEM SERVICIOS EMPRESARIALES SC'],
    ['type', 'CSD'],
    ['serial-number', '30001000000300023708'],
  ])('extracts single field %s', async (field, expected) => {
    const result = await invokeCli(['data', '--cer', csdCer, '--field', field]);

    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
  });

  test('extracts field in JSON format when --field and --json are combined', async () => {
    const result = await invokeCli(['data', '--cer', csdCer, '--field', 'rfc', '--json']);

    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toStrictEqual({ rfc: 'AAA010101AAA' });
  });

  test('reads certificate data from PFX file using env password', async () => {
    const result = await invokeCli(['data', '--pfx', pfxProtected, '--field', 'rfc'], {
      env: { NODECFDI_PASSWORD: pfxPassword },
    });

    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe('AAA010101AAA');
  });

  test('fails on unknown field or missing source', async () => {
    const unknownField = await invokeCli(['data', '--cer', csdCer, '--field', 'invalido']);
    expect(unknownField.code).toBe(2);
    expect(unknownField.stderr).toContain('Valor no esperado para --field: "invalido"');

    const noSource = await invokeCli(['data']);
    expect(noSource.code).toBe(2);
    expect(noSource.stderr).toContain('Debes especificar --cer <ruta> o --pfx <ruta>');
  });
});
