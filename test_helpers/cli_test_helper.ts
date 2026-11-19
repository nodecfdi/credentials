import type { CliIO } from '../src/cli/types';
import { Buffer } from 'node:buffer';
import { runCli } from '../src/cli';

export interface CliRunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export async function invokeCli(
  argv: string[],
  options: { stdin?: string; env?: Record<string, string | undefined> } = {},
): Promise<CliRunResult> {
  let stdout = '';
  let stderr = '';

  const io: CliIO = {
    stdout: (text: string): void => {
      stdout += text;
    },
    stderr: (text: string): void => {
      stderr += text;
    },
    readStdin: (): Uint8Array => Buffer.from(options.stdin ?? '', 'utf8'),
    env: options.env ?? {},
  };

  const code = await runCli(argv, io);

  return { code, stdout, stderr };
}
