import type { CliIO } from '../types';
import { Buffer } from 'node:buffer';
import { ALGORITHMS, ENCODINGS } from '../constants';
import { CliUsageError } from '../errors';
import { writeOutputFile } from '../fs';
import { SIGN_HELP } from '../help';
import { loadInputData, loadSigner } from '../loaders';
import { HELP_OPTIONS, parseChoice, parseCommandArgs, PASSWORD_OPTIONS } from '../options';
import { encodeSignature } from '../signature';

const OPTIONS = {
  key: { type: 'string', short: 'k' },
  cer: { type: 'string', short: 'c' },
  pfx: { type: 'string' },
  ...PASSWORD_OPTIONS,
  data: { type: 'string', short: 'd' },
  file: { type: 'string', short: 'f' },
  algorithm: { type: 'string', short: 'a' },
  encoding: { type: 'string', short: 'e' },
  output: { type: 'string', short: 'o' },
  force: { type: 'boolean' },
  ...HELP_OPTIONS,
} as const;

export async function runSignCommand(argv: string[], io: CliIO): Promise<number> {
  const values = parseCommandArgs(argv, OPTIONS);

  if (values.help) {
    io.stdout(SIGN_HELP);

    return 0;
  }

  const algorithm = parseChoice('algorithm', values.algorithm, ALGORITHMS) ?? 'sha256';
  const encoding = parseChoice('encoding', values.encoding, ENCODINGS) ?? 'base64';

  if (encoding === 'binary' && values.output === undefined) {
    throw new CliUsageError('--encoding binary requiere --output <ruta> (no se imprime binario por stdout).');
  }

  if (values.force && values.output === undefined) {
    throw new CliUsageError('--force solo aplica junto con --output <ruta>.');
  }

  const input = await loadInputData(values, io);
  const signature = encodeSignature(loadSigner(values, io).sign(input, algorithm), encoding);

  if (values.output === undefined) {
    io.stdout(`${signature}\n`);

    return 0;
  }

  writeOutputFile(values.output, encoding === 'binary' ? Buffer.from(signature, 'binary') : signature, values.force);
  io.stdout(`Firma guardada en ${values.output}\n`);

  return 0;
}
