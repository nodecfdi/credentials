import type { CliIO, CommandHandler } from './types';
import { readFileSync } from 'node:fs';
import { runDataCommand } from './commands/data';
import { runPfxCommand } from './commands/pfx';
import { runSignCommand } from './commands/sign';
import { runVerifyCommand } from './commands/verify';
import { EXIT_ERROR, EXIT_USAGE } from './constants';
import { CliUsageError } from './errors';
import { ROOT_HELP } from './help';
import { getDefaultIO } from './io';

const COMMANDS: Record<string, CommandHandler> = {
  data: runDataCommand,
  info: runDataCommand,
  sign: runSignCommand,
  verify: runVerifyCommand,
  pfx: runPfxCommand,
};

function getPackageVersion(): string {
  for (const relative of ['../package.json', '../../package.json']) {
    try {
      const content = JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8')) as { version?: string };
      if (content.version) {
        return content.version;
      }
    } catch {
      // Intenta la siguiente ubicación.
    }
  }

  return '0.0.0';
}

function runRootFlag(command: string, rest: string[], io: CliIO): number {
  if (rest.length > 0) {
    throw new CliUsageError(`Argumento inesperado: "${rest[0]}".`);
  }

  io.stdout(command === '--version' || command === '-v' ? `${getPackageVersion()}\n` : ROOT_HELP);

  return 0;
}

/**
 * Ejecuta el CLI y devuelve el código de salida:
 * 0 éxito, 1 error de ejecución o firma inválida, 2 error de uso (argumentos inválidos).
 */
export async function runCli(argv: string[], ioOverrides?: Partial<CliIO>): Promise<number> {
  const io = getDefaultIO(ioOverrides);
  const [command, ...rest] = argv;

  try {
    if (command === undefined) {
      io.stdout(ROOT_HELP);

      return 0;
    }

    if (['-h', '--help', '-v', '--version'].includes(command)) {
      return runRootFlag(command, rest, io);
    }

    // Object.hasOwn evita resolver propiedades heredadas (p. ej. "constructor").
    const handler = Object.hasOwn(COMMANDS, command) ? COMMANDS[command] : undefined;
    if (!handler) {
      throw new CliUsageError(`Comando desconocido: "${command}".`);
    }

    return await handler(rest, io);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof CliUsageError) {
      io.stderr(`Error: ${message}\nEjecuta "nc-credentials --help" para ver el uso.\n`);

      return EXIT_USAGE;
    }

    io.stderr(`Error: ${message}\n`);

    return EXIT_ERROR;
  }
}
