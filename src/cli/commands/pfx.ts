import type { CliIO } from '../types';
import { Buffer } from 'node:buffer';
import { openCredentialFiles } from '../../node';
import PfxExporter from '../../pfx/pfx_exporter';
import { PFX_ALGORITHMS } from '../constants';
import { CliUsageError } from '../errors';
import { writeOutputFile } from '../fs';
import { PFX_HELP } from '../help';
import { HELP_OPTIONS, parseChoice, parseCommandArgs, PASSWORD_OPTIONS } from '../options';
import { resolveSecret } from '../secrets';

const OPTIONS = {
  'cer': { type: 'string', short: 'c' },
  'key': { type: 'string', short: 'k' },
  ...PASSWORD_OPTIONS,
  'pfx-password': { type: 'string' },
  'pfx-password-file': { type: 'string' },
  'output': { type: 'string', short: 'o' },
  'algorithm': { type: 'string', short: 'a' },
  'force': { type: 'boolean' },
  ...HELP_OPTIONS,
} as const;

export function runPfxCommand(argv: string[], io: CliIO): number {
  const [subcommand, ...rest] = argv;

  if (subcommand === undefined || subcommand === '--help' || subcommand === '-h') {
    if (rest.length > 0) {
      throw new CliUsageError(`Argumento inesperado: "${rest[0]}".`);
    }

    io.stdout(PFX_HELP);

    return 0;
  }

  if (subcommand !== 'export') {
    throw new CliUsageError(`Subcomando desconocido para pfx: "${subcommand}". Subcomandos permitidos: export.`);
  }

  const values = parseCommandArgs(rest, OPTIONS);

  if (values.help) {
    io.stdout(PFX_HELP);

    return 0;
  }

  if (values.cer === undefined || values.key === undefined) {
    throw new CliUsageError('Debes especificar --cer <ruta> y --key <ruta>.');
  }

  if (values.output === undefined) {
    throw new CliUsageError('Debes especificar --output <ruta> para guardar el archivo .pfx.');
  }

  const algorithm = parseChoice('algorithm', values.algorithm, PFX_ALGORITHMS);
  const keyPassword = resolveSecret(
    io,
    { value: values.password, file: values['password-file'] },
    { option: 'password', fileOption: 'password-file' },
  );
  const hasPfxPassword = values['pfx-password'] !== undefined || values['pfx-password-file'] !== undefined;
  const pfxPassword = hasPfxPassword
    ? resolveSecret(
        io,
        { value: values['pfx-password'], file: values['pfx-password-file'] },
        { option: 'pfx-password', fileOption: 'pfx-password-file', envKey: 'NODECFDI_PFX_PASSWORD' },
      )
    : keyPassword;

  const credential = openCredentialFiles(values.cer, values.key, keyPassword);
  const bytes = Buffer.from(new PfxExporter(credential).export(pfxPassword, algorithm), 'binary');

  writeOutputFile(values.output, bytes, values.force);
  io.stdout(`Archivo PFX exportado en ${values.output}\n`);

  return 0;
}
