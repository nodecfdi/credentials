/* eslint-disable unicorn/prefer-https */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { localFileOpen } from '../../../src/node/local_file_open';
import { utilities } from '../../test_utilities.js';

describe('local file open', () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  test('open with flat path', () => {
    const filename = utilities.filePath('FIEL_AAA010101AAA/password.txt');
    const content = localFileOpen(filename);

    expect(content).toStrictEqual(readFileSync(filename).toString('utf8'));
  });

  test('open with file scheme_on_path', () => {
    const filename = `file://${utilities.filePath('FIEL_AAA010101AAA/password.txt')}`;
    const content = localFileOpen(filename);

    expect(content).toStrictEqual(readFileSync(filename.replace('file://', '')).toString('utf8'));
  });

  test('open empty file', () => {
    const t = (): string => localFileOpen('');

    expect(t).toThrow(Error);
    expect(t).toThrow('The file to open is empty');
  });

  test('open with double scheme on path', () => {
    const filename = 'file://http://example.com/index.htm';

    const t = (): string => localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid scheme to open file');
  });

  test('open with directory', () => {
    const filename = __dirname;

    const t = (): string => localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('File content is empty');
  });

  test('open with non existent path', () => {
    const filename = `${__dirname}/nonexistent`;

    const t = (): string => localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });

  test.each([
    ['c:/certs/file.txt'],
    ['file://c:/certs/file.txt'],
    [String.raw`c:\certs\file.txt`],
    [String.raw`file://c:\certs\file.txt`],
  ])('open with windows path %s', (filename) => {
    const t = (): string => localFileOpen(filename);

    expect(t).toThrow(Error);
    expect(t).toThrow('Unable to locate the file to open');
  });
});
