import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { filePath } from '../../test_utils.js';
import LocalFileOpenSpecimen from './local_file_open_specimen.js';

describe('local file open', () => {
  let specimen: LocalFileOpenSpecimen;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  beforeAll(() => {
    specimen = new LocalFileOpenSpecimen();
  });

  test('open with flat path', () => {
    const filename = filePath('FIEL_AAA010101AAA/password.txt');
    const content = specimen.localFileOpen(filename);

    expect(content).toStrictEqual(readFileSync(filename).toString('utf8'));
  });

  test('open with file scheme_on_path', () => {
    const filename = `file://${filePath('FIEL_AAA010101AAA/password.txt')}`;
    const content = specimen.localFileOpen(filename);

    expect(content).toStrictEqual(readFileSync(filename.replace('file://', '')).toString('utf8'));
  });

  test('open empty file', () => {
    const t = (): string => specimen.localFileOpen('');

    expect(t).toThrow(Error);
    expect(t).toThrow('The file to open is empty');
  });

  test('open with double scheme on path', () => {
    const filename = 'file://http://example.com/index.htm';

    const t = (): string => specimen.localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid scheme to open file');
  });

  test('open with directory', () => {
    const filename = __dirname;

    const t = (): string => specimen.localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('File content is empty');
  });

  test('open with non existent path', () => {
    const filename = `${__dirname}/nonexistent`;

    const t = (): string => specimen.localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });

  test.each([
    ['c:/certs/file.txt'],
    ['file://c:/certs/file.txt'],
    [String.raw`c:\certs\file.txt`],
    [String.raw`file://c:\certs\file.txt`],
  ])('open with windows path %s', (filename) => {
    const t = (): string => specimen.localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });
});
