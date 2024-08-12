import { readFileSync, realpathSync } from 'node:fs';

export default abstract class LocalFileOpen {
  /**
   * Read file and return file contents as binary string
   *
   * @param file - file name to be read
   * @returns binary string of file contents
   *
   * This function only works in Node.js.
   */
  public static localFileOpen(file: string): string {
    let filename = file;

    if (filename.startsWith('file://')) {
      filename = filename.slice(7);
    }

    if (filename === '') {
      throw new Error('The file to open is empty');
    }

    // eslint-disable-next-line security/detect-unsafe-regex
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
}
