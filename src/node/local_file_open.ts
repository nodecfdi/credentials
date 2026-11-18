import { readFileSync, realpathSync } from 'node:fs';

/**
 * Read a local file and return its contents as a binary string.
 *
 * This function only works in Node.js.
 *
 * @param file - file name to be read (plain path or file:// URI)
 * @returns binary string of file contents
 */
export function localFileOpen(file: string): string {
  let filename = file;

  if (filename.startsWith('file://')) {
    filename = filename.slice(7);
  }

  if (filename === '') {
    throw new Error('The file to open is empty');
  }

  if (/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[\da-z-]+\.[\da-z-]\S*$/i.test(filename)) {
    throw new Error('Invalid scheme to open file');
  }

  let path = '';
  try {
    path = realpathSync(filename);
  } catch {
    throw new Error('Unable to locate the file to open');
  }

  let contents = '';
  try {
    contents = readFileSync(path, 'binary');
  } catch {
    throw new Error('File content is empty');
  }

  return contents;
}
