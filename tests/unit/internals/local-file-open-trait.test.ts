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
        expect.hasAssertions();
        try {
            specimen.localFileOpen('');
        } catch (e) {
            expect(e).toBeInstanceOf(SyntaxError);
            expect(e).toHaveProperty('message', 'The file to open is empty');
        }
    });

    test('open with double scheme on path', () => {
        const filename = 'file://http://example.com/index.htm';

        expect.hasAssertions();
        try {
            specimen.localFileOpen(filename);
        } catch (e) {
            expect(e).toBeInstanceOf(SyntaxError);
            expect(e).toHaveProperty('message', 'Invalid scheme to open file');
        }
    });

    test('open with directory', () => {
        const filename = __dirname;

        expect.hasAssertions();
        try {
            specimen.localFileOpen(filename);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'File content is empty');
        }
    });

    test('open with non existent path', () => {
        const filename = `${__dirname}/nonexistent`;

        expect.hasAssertions();
        try {
            specimen.localFileOpen(filename);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Unable to locate the file to open');
        }
    });

    test.each([
        ['c:/certs/file.txt'],
        ['file://c:/certs/file.txt'],
        ['c:\\certs\\file.txt'],
        ['file://c:\\certs\\file.txt'],
    ])('open with windows path', (filename) => {
        expect.hasAssertions();
        try {
            specimen.localFileOpen(filename);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Unable to locate the file to open');
        }
    });
});
