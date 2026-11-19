import type { Buffer } from 'node:buffer';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { CliUsageError } from './errors';

function errnoCode(error: unknown): string {
  return (error as { code?: string }).code ?? 'desconocido';
}

/**
 * Lee un archivo regular con límite de tamaño.
 */
export function readFileLimited(path: string, maxBytes: number, label: string): Buffer {
  let size: number;
  try {
    const stats = statSync(path);
    if (!stats.isFile()) {
      throw new CliUsageError(`${label}: "${path}" no es un archivo regular.`);
    }

    size = stats.size;
  } catch (error) {
    if (error instanceof CliUsageError) {
      throw error;
    }

    throw new CliUsageError(`No se pudo acceder a ${label}: "${path}" (${errnoCode(error)}).`);
  }

  if (size > maxBytes) {
    throw new CliUsageError(`${label}: "${path}" excede el tamaño máximo permitido de ${maxBytes} bytes.`);
  }

  try {
    return readFileSync(path);
  } catch (error) {
    throw new CliUsageError(`No se pudo leer ${label}: "${path}" (${errnoCode(error)}).`);
  }
}

/**
 * Escribe un archivo de salida con permisos 0600.
 * No sobrescribe archivos existentes salvo que se indique `force`.
 */
export function writeOutputFile(path: string, content: Uint8Array | string, force = false): void {
  try {
    writeFileSync(path, content, { flag: force ? 'w' : 'wx', mode: 0o600 });
  } catch (error) {
    if (errnoCode(error) === 'EEXIST') {
      throw new CliUsageError(`El archivo de salida ya existe: "${path}". Usa --force para sobrescribirlo.`);
    }

    throw new CliUsageError(`No se pudo escribir el archivo de salida "${path}" (${errnoCode(error)}).`);
  }
}
