import { describe, expect, test } from 'vitest';
import { invokeCli } from '../../../test_helpers/cli_test_helper';

describe('cli root', () => {
  test.each([
    [[]],
    [['--help']],
    [['-h']],
  ])('prints root help with %j', async (argv) => {
    const result = await invokeCli(argv);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Uso: nc-credentials <comando> [opciones]');
    expect(result.stdout).toContain('data, info');
    expect(result.stdout).toContain('sign');
    expect(result.stdout).toContain('verify');
    expect(result.stdout).toContain('pfx export');
  });

  test.each([['--version'], ['-v']])('prints package version with %s', async (flag) => {
    const result = await invokeCli([flag]);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  test('returns error for unknown command', async () => {
    const result = await invokeCli(['desconocido']);

    expect(result.code).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Comando desconocido: "desconocido"');
  });

  test.each([
    ['data', 'Uso: nc-credentials data'],
    ['info', 'Uso: nc-credentials data'],
    ['sign', 'Uso: nc-credentials sign'],
    ['verify', 'Uso: nc-credentials verify'],
    ['pfx', 'Uso: nc-credentials pfx export'],
  ])('prints help for subcommand %s', async (command, expectedHeader) => {
    const result = await invokeCli([command, '--help']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain(expectedHeader);
  });
});
