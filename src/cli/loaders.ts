import type Certificate from '../certificate';
import type Credential from '../credential';
import type PrivateKey from '../private_key';
import type { CliIO, DataInputValues, SourceValues } from './types';
import { Buffer } from 'node:buffer';
import { openCertificateFile, openCredentialFiles, openPrivateKeyFile, readPfxFile } from '../node';
import { MAX_INPUT_BYTES } from './constants';
import { CliUsageError } from './errors';
import { readFileLimited } from './fs';
import { assertMutuallyExclusive, assertNotAllowed } from './options';
import { resolvePassword } from './secrets';

const PASSWORD_ONLY_PFX = 'solo aplica con --pfx';

export function loadCertificate(values: SourceValues, io: CliIO): Certificate {
  assertMutuallyExclusive(values as Record<string, unknown>, ['cer', 'pfx']);

  if (values.pfx !== undefined) {
    return readPfxFile(values.pfx, resolvePassword(values, io)).certificate();
  }

  if (values.cer === undefined) {
    throw new CliUsageError('Debes especificar --cer <ruta> o --pfx <ruta>.');
  }

  assertNotAllowed(values as Record<string, unknown>, ['password', 'password-file'], PASSWORD_ONLY_PFX);

  return openCertificateFile(values.cer);
}

/**
 * Carga lo necesario para firmar: .pfx, o llave privada (con certificado opcional).
 */
export function loadSigner(values: SourceValues, io: CliIO): Credential | PrivateKey {
  if (values.pfx !== undefined) {
    assertNotAllowed(values as Record<string, unknown>, ['cer', 'key'], 'no puede combinarse con --pfx');

    return readPfxFile(values.pfx, resolvePassword(values, io));
  }

  if (values.key === undefined) {
    throw new CliUsageError('Debes especificar --key <ruta> (opcionalmente con --cer <ruta>) o --pfx <ruta>.');
  }

  const password = resolvePassword(values, io);

  return values.cer === undefined
    ? openPrivateKeyFile(values.key, password)
    : openCredentialFiles(values.cer, values.key, password);
}

/**
 * Obtiene los datos de entrada como string binario (bytes exactos; texto en UTF-8).
 */
export async function loadInputData(values: DataInputValues, io: CliIO): Promise<string> {
  assertMutuallyExclusive(values as Record<string, unknown>, ['data', 'file']);

  let bytes: Uint8Array;
  if (values.data !== undefined) {
    bytes = Buffer.from(values.data, 'utf8');
  } else if (values.file === undefined) {
    bytes = await io.readStdin();
    if (bytes.length > MAX_INPUT_BYTES) {
      throw new CliUsageError(`Los datos de stdin exceden el tamaño máximo permitido de ${MAX_INPUT_BYTES} bytes.`);
    }
  } else {
    bytes = readFileLimited(values.file, MAX_INPUT_BYTES, 'el archivo de datos');
  }

  if (bytes.length === 0) {
    throw new CliUsageError('Los datos de entrada están vacíos.');
  }

  return Buffer.from(bytes).toString('binary');
}
