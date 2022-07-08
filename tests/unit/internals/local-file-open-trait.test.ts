import { TestCase } from '../../test-case';
import { LocalFileOpenTraitSpecimen } from './local-file-open-trait-specimen';
import { readFileSync } from 'fs';

describe('LocalFileOpenTrait', () => {
    let specimen: LocalFileOpenTraitSpecimen;

    beforeAll(() => {
        specimen = new LocalFileOpenTraitSpecimen();
    });

    test('open with flat path', () => {
        const filename = TestCase.filePath('FIEL_AAA010101AAA/password.txt');
        const content = specimen.localFileOpen(filename);

        expect(content).toEqual(readFileSync(filename).toString('utf-8'));
    });

    test('open with file scheme on path', () => {
        const filename = `file://${TestCase.filePath('FIEL_AAA010101AAA/password.txt')}`;
        const content = specimen.localFileOpen(filename);

        expect(content).toEqual(readFileSync(filename.replace('file://', '')).toString('utf-8'));
    });

    test('open empty file', () => {
        const t = (): string => {
            return specimen.localFileOpen('');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('The file to open is empty');
    });

    test('open with double scheme on path', () => {
        const filename = 'file://http://example.com/index.htm';

        const t = (): string => {
            return specimen.localFileOpen(filename);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Invalid scheme to open file');
    });

    test('open with directory', () => {
        const filename = __dirname;

        const t = (): string => {
            return specimen.localFileOpen(filename);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('File content is empty');
    });

    test('open with non existent path', () => {
        const filename = `${__dirname}/nonexistent`;

        const t = (): string => {
            return specimen.localFileOpen(filename);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Unable to locate the file to open');
    });

    test.each([
        ['c:/certs/file.txt'],
        ['file://c:/certs/file.txt'],
        ['c:\\certs\\file.txt'],
        ['file://c:\\certs\\file.txt']
    ])('open with windows path %s', (filename) => {
        const t = (): string => {
            return specimen.localFileOpen(filename);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Unable to locate the file to open');
    });
});
