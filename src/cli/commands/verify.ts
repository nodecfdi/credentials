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

export async function runVerifyCommand(argv: string[], io: CliIO): Promise<number> {
  const values = parseCommandArgs(argv, OPTIONS);

  if (values.help) {
    io.stdout(VERIFY_HELP);

    return 0;
  }

  assertMutuallyExclusive(values, ['cer', 'public-key', 'pfx']);
  assertMutuallyExclusive(values, ['signature', 'signature-file']);

  if (values.signature === undefined && values['signature-file'] === undefined) {
    throw new CliUsageError('Debes especificar --signature <firma> o --signature-file <ruta>.');
  }

  const algorithm = parseChoice('algorithm', values.algorithm, ALGORITHMS) ?? 'sha256';
  const encoding = parseChoice('encoding', values.encoding, ENCODINGS) ?? 'base64';

  if (encoding === 'binary' && values.signature !== undefined) {
    throw new CliUsageError('--encoding binary requiere --signature-file <ruta> (no se acepta binario como argumento).');
  }

  let binarySignature: string;
  if (values.signature === undefined) {
    const raw = readFileLimited(values['signature-file']!, MAX_INPUT_BYTES, 'el archivo de firma');
    binarySignature = encoding === 'binary' ? raw.toString('binary') : decodeSignature(raw.toString('utf8'), encoding);
  } else {
    binarySignature = decodeSignature(values.signature, encoding as 'base64' | 'hex');
  }

  const input = await loadInputData(values, io);

  let publicKey: PublicKey;
  if (values['public-key'] === undefined) {
    publicKey = loadCertificate(values, io).publicKey();
  } else {
    assertNotAllowed(values, ['password', 'password-file'], 'solo aplica con --pfx');
    publicKey = openPublicKeyFile(values['public-key']);
  }

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
