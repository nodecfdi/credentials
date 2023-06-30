import { useTestCase } from '../../test-case.js';
import { LocalFileOpenTraitSpecimen } from './local-file-open-trait-specimen.js';

describe('LocalFileOpenTraitBrowser', () => {
    let specimen: LocalFileOpenTraitSpecimen;
    const { filePath } = useTestCase();

    beforeAll(() => {
        specimen = new LocalFileOpenTraitSpecimen();
    });

    test('open_on_browser_throws_error', () => {
        const filename = filePath('FIEL_AAA010101AAA/password.txt');

        const t = (): string => {
            return specimen.localFileOpen2(filename);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Método no disponible en browser');
    });
});
