import type { SignatureEncoding } from './types';
import { Buffer } from 'node:buffer';
import { CliUsageError } from './errors';

export function encodeSignature(binarySignature: string, encoding: SignatureEncoding): string {
  return encoding === 'binary' ? binarySignature : Buffer.from(binarySignature, 'binary').toString(encoding);
}

/**
 * Decodifica una firma en base64 o hex validando estrictamente su formato.
 */
export function decodeSignature(signature: string, encoding: Exclude<SignatureEncoding, 'binary'>): string {
  const cleaned = signature.replaceAll(/\s+/g, '');

  if (cleaned === '') {
    throw new CliUsageError('La firma está vacía.');
  }

  if (encoding === 'hex' && !/^(?:[\da-f]{2})+$/i.test(cleaned)) {
    throw new CliUsageError('La firma no es hexadecimal válida (caracteres inválidos o longitud impar).');
  }

  if (encoding === 'base64' && !/^(?:[\d+/A-Z]{4})*(?:[\d+/A-Z]{2}==|[\d+/A-Z]{3}=)?$/i.test(cleaned)) {
    throw new CliUsageError('La firma no es base64 válida.');
  }

  return Buffer.from(cleaned, encoding).toString('binary');
}
