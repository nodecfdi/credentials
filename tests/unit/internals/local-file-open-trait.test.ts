import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { useTestCase } from '../../test-case.js';
import { LocalFileOpenTraitSpecimen } from './local-file-open-trait-specimen.js';

describe('LocalFileOpenTrait', () => {
  let specimen: LocalFileOpenTraitSpecimen;
  const { filePath } = useTestCase();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  beforeAll(() => {
    specimen = new LocalFileOpenTraitSpecimen();
  });

  test('open_with_flat_path', () => {
    const filename = filePath('FIEL_AAA010101AAA/password.txt');
    const content = specimen.localFileOpen2(filename);

    expect(content).toEqual(readFileSync(filename).toString('utf8'));
  });

  test('open_with_file_scheme_on_path', () => {
    const filename = `file://${filePath('FIEL_AAA010101AAA/password.txt')}`;
    const content = specimen.localFileOpen2(filename);

    expect(content).toEqual(readFileSync(filename.replace('file://', '')).toString('utf8'));
  });

  test('open_empty_file', () => {
    const t = (): string => specimen.localFileOpen2('');

    expect(t).toThrow(Error);
    expect(t).toThrow('The file to open is empty');
  });

  test('open_with_double_scheme_on_path', () => {
    const filename = 'file://http://example.com/index.htm';

    const t = (): string => specimen.localFileOpen2(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid scheme to open file');
  });

  test('open_with_directory', () => {
    const filename = __dirname;

    const t = (): string => specimen.localFileOpen2(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('File content is empty');
  });

  test('open_with_non_existent_path', () => {
    const filename = `${__dirname}/nonexistent`;

    const t = (): string => specimen.localFileOpen2(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });

  test.each([
    ['c:/certs/file.txt'],
    ['file://c:/certs/file.txt'],
    ['c:\\certs\\file.txt'],
    ['file://c:\\certs\\file.txt'],
  ])('open_with_windows_path_%s', (filename) => {
    const t = (): string => specimen.localFileOpen2(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });
});
