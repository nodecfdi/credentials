import type PublicKey from '../../public_key';
import type { CliIO } from '../types';
import { openPublicKeyFile } from '../../node';
import { ALGORITHMS, ENCODINGS, MAX_INPUT_BYTES } from '../constants';
import { CliUsageError } from '../errors';
import { readFileLimited } from '../fs';
import { VERIFY_HELP } from '../help';
import { loadCertificate, loadInputData } from '../loaders';
import {
  assertMutuallyExclusive,
  assertNotAllowed,
  HELP_OPTIONS,
  parseChoice,
  parseCommandArgs,
  PASSWORD_OPTIONS,
} from '../options';
import { decodeSignature } from '../signature';

const OPTIONS = {
  'cer': { type: 'string', short: 'c' },
  'public-key': { type: 'string' },
  'pfx': { type: 'string' },
  ...PASSWORD_OPTIONS,
  'data': { type: 'string', short: 'd' },
  'file': { type: 'string', short: 'f' },
  'signature': { type: 'string', short: 's' },
  'signature-file': { type: 'string' },
  'algorithm': { type: 'string', short: 'a' },
  'encoding': { type: 'string', short: 'e' },
  'quiet': { type: 'boolean', short: 'q' },
  ...HELP_OPTIONS,
} as const;

function loadBinarySignature(
  signature: string | undefined,
  signatureFile: string | undefined,
  encoding: (typeof ENCODINGS)[number],
): string {
  if (signature !== undefined) {
    if (encoding === 'binary') {
      throw new CliUsageError('--encoding binary requiere --signature-file <ruta> (no se acepta binario como argumento).');
    }

    return decodeSignature(signature, encoding);
  }

  if (signatureFile === undefined) {
    throw new CliUsageError('Debes especificar --signature <firma> o --signature-file <ruta>.');
  }

  const raw = readFileLimited(signatureFile, MAX_INPUT_BYTES, 'el archivo de firma');

  return encoding === 'binary' ? raw.toString('binary') : decodeSignature(raw.toString('utf8'), encoding);
}

function loadVerifyPublicKey(
  values: { 'cer'?: string; 'pfx'?: string; 'public-key'?: string; 'password'?: string; 'password-file'?: string },
  io: CliIO,
): PublicKey {
  if (values['public-key'] === undefined) {
    return loadCertificate(values, io).publicKey();
  }

  assertNotAllowed(values, ['password', 'password-file'], 'solo aplica con --pfx');

  return openPublicKeyFile(values['public-key']);
}

export async function runVerifyCommand(argv: string[], io: CliIO): Promise<number> {
  const values = parseCommandArgs(argv, OPTIONS);

  if (values.help) {
    io.stdout(VERIFY_HELP);

    return 0;
  }

  assertMutuallyExclusive(values, ['cer', 'public-key', 'pfx']);
  assertMutuallyExclusive(values, ['signature', 'signature-file']);

  const algorithm = parseChoice('algorithm', values.algorithm, ALGORITHMS) ?? 'sha256';
  const encoding = parseChoice('encoding', values.encoding, ENCODINGS) ?? 'base64';
  const binarySignature = loadBinarySignature(values.signature, values['signature-file'], encoding);
  const input = await loadInputData(values, io);
  const publicKey = loadVerifyPublicKey(values, io);

  let isValid: boolean;
  try {
    isValid = publicKey.verify(input, binarySignature, algorithm);
  } catch {
    // Firma con longitud/estructura incompatible con la llave: se considera inválida.
    isValid = false;
  }

  if (!values.quiet) {
    io.stdout(isValid ? 'Firma válida\n' : 'Firma inválida\n');
  }

  return isValid ? 0 : 1;
}
