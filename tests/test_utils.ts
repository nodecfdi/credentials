import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Get filename for a given file path URL
 */
export const getFilename = (url: string | URL): string => {
  return fileURLToPath(url);
};

/**
 * Get dirname for a given file path URL
 */
export const getDirname = (url: string | URL): string => {
  return path.dirname(getFilename(url));
};

export const filePath = (file: string): string =>
  path.join(getDirname(import.meta.url), '_files', file);

export const fileContents = (file: string): string => {
  if (!existsSync(filePath(file))) {
    return '';
  }

  return readFileSync(filePath(file), 'binary');
};
