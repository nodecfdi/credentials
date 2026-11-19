import type { ReadFileSyncOptionsWithBufferEncoding } from 'node:fs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const utilities = {
  filePath: (append = ''): string => path.join(import.meta.dirname, '_files', append),
  fileContent: (filePath: string, options?: { fromEncoding?: ReadFileSyncOptionsWithBufferEncoding; toEncoding?: BufferEncoding }): string => {
    if (!existsSync(filePath)) {
      return '';
    }

    const file = readFileSync(filePath, options?.fromEncoding);

    return file.toString(options?.toEncoding ?? 'binary');
  },
  fileContents: (append: string): string => utilities.fileContent(utilities.filePath(append)),
} as const;
