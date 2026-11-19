/**
 * Error de uso del CLI (argumentos inválidos o inesperados).
 * Se reporta con código de salida 2.
 */
export class CliUsageError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'CliUsageError';
  }
}
