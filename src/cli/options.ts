import type { ParseArgsOptionsConfig } from 'node:util';
import type { ParsedValues } from './types';
import { parseArgs } from 'node:util';
import { CliUsageError } from './errors';

export const PASSWORD_OPTIONS = {
  'password': { type: 'string', short: 'p' },
  'password-file': { type: 'string' },
} as const satisfies ParseArgsOptionsConfig;

export const HELP_OPTIONS = {
  help: { type: 'boolean', short: 'h' },
} as const satisfies ParseArgsOptionsConfig;

/**
 * Opciones de texto que pueden recibir un valor vacío (contraseñas sin protección).
 */
const EMPTY_ALLOWED = new Set(['password', 'pfx-password']);

function translateParseError(error: unknown): Error {
  if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
    const quoted = /'([^']+)'/.exec(error.message)?.[1] ?? '';

    switch (error.code) {
      case 'ERR_PARSE_ARGS_UNKNOWN_OPTION': {
        return new CliUsageError(`Opción desconocida: "${quoted}".`);
      }

      case 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE': {
        return new CliUsageError(`Valor faltante o inválido para la opción "${quoted}".`);
      }

      default: {
        return new CliUsageError(error.message);
      }
    }
  }

  return error as Error;
}

/**
 * Parsea y valida estrictamente los argumentos de un comando.
 * Se detiene con CliUsageError ante opciones desconocidas, repetidas, vacías o argumentos posicionales.
 */
export function parseCommandArgs<T extends ParseArgsOptionsConfig>(
  argv: string[],
  options: T,
): ParsedValues<T> {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options,
      strict: true,
      allowPositionals: true,
      tokens: true,
    });
  } catch (error) {
    throw translateParseError(error);
  }

  const seen = new Set<string>();
  for (const token of parsed.tokens) {
    if (token.kind === 'positional') {
      throw new CliUsageError(`Argumento inesperado: "${token.value}".`);
    }

    if (token.kind === 'option-terminator') {
      throw new CliUsageError('Argumento inesperado: "--".');
    }

    if (seen.has(token.name)) {
      throw new CliUsageError(`La opción "--${token.name}" se indicó más de una vez.`);
    }

    seen.add(token.name);

    if (token.value === '' && !EMPTY_ALLOWED.has(token.name)) {
      throw new CliUsageError(`La opción "--${token.name}" no puede estar vacía.`);
    }
  }

  return parsed.values;
}

/**
 * Valida que un valor pertenezca a un conjunto permitido.
 * Devuelve undefined si no se indicó valor.
 */
export function parseChoice<T extends string>(
  option: string,
  value: string | undefined,
  choices: readonly T[],
): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  const match = choices.find((choice) => choice === value);
  if (match === undefined) {
    throw new CliUsageError(
      `Valor no esperado para --${option}: "${value}". Valores permitidos: ${choices.join(', ')}.`,
    );
  }

  return match;
}

/**
 * Lanza error si se indicó más de una de las opciones dadas.
 */
export function assertMutuallyExclusive(
  values: Record<string, unknown>,
  names: readonly string[],
): void {
  const present = names.filter((name) => values[name] !== undefined);
  if (present.length > 1) {
    throw new CliUsageError(
      `Las opciones ${present.map((name) => `--${name}`).join(' y ')} no pueden usarse al mismo tiempo.`,
    );
  }
}

/**
 * Lanza error si se indicó alguna de las opciones dadas que no aplica en el contexto.
 */
export function assertNotAllowed(
  values: Record<string, unknown>,
  names: readonly string[],
  reason: string,
): void {
  for (const name of names) {
    if (values[name] !== undefined) {
      throw new CliUsageError(`La opción "--${name}" ${reason}.`);
    }
  }
}
