import type { CliIO, SecretNames, SecretSource, SourceValues } from './types';
import { MAX_PASSWORD_FILE_BYTES, PASSWORD_ENV_KEY } from './constants';
import { CliUsageError } from './errors';
import { readFileLimited } from './fs';

/**
 * Resuelve una contraseña desde opción, archivo o variable de entorno.
 */
export function resolveSecret(io: CliIO, source: SecretSource, names: SecretNames): string {
  if (source.value !== undefined && source.file !== undefined) {
    throw new CliUsageError(`Las opciones --${names.option} y --${names.fileOption} no pueden usarse al mismo tiempo.`);
  }

  if (source.value !== undefined) {
    io.stderr(
      `Advertencia: --${names.option} expone la contraseña en la lista de procesos; prefiere --${names.fileOption} o ${names.envKey ?? PASSWORD_ENV_KEY}.\n`,
    );

    return source.value;
  }

  if (source.file !== undefined) {
    return readFileLimited(source.file, MAX_PASSWORD_FILE_BYTES, 'el archivo de contraseña')
      .toString('utf8')
      .replace(/\r?\n$/, '');
  }

  return names.envKey === undefined ? (io.env[PASSWORD_ENV_KEY] ?? '') : (io.env[names.envKey] ?? '');
}

export function resolvePassword(values: SourceValues, io: CliIO): string {
  return resolveSecret(io, { value: values.password, file: values['password-file'] }, {
    option: 'password',
    fileOption: 'password-file',
  });
}
