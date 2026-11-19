import type { CliIO } from './types';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { MAX_INPUT_BYTES } from './constants';
import { CliUsageError } from './errors';

async function readDefaultStdin(): Promise<Uint8Array> {
  if (process.stdin.isTTY) {
    throw new CliUsageError('No se indicó --data ni --file y no hay datos por stdin.');
  }

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of process.stdin) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer);
    total += buffer.length;
    if (total > MAX_INPUT_BYTES) {
      throw new CliUsageError(`Los datos de stdin exceden el tamaño máximo permitido de ${MAX_INPUT_BYTES} bytes.`);
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

export function getDefaultIO(overrides?: Partial<CliIO>): CliIO {
  return {
    stdout: overrides?.stdout ?? ((text: string): void => {
      process.stdout.write(text);
    }),
    stderr: overrides?.stderr ?? ((text: string): void => {
      process.stderr.write(text);
    }),
    readStdin: overrides?.readStdin ?? readDefaultStdin,
    env: overrides?.env ?? process.env,
  };
}
