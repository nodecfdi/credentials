import { Certificate } from 'src/certificate';
import { useTestCase } from '../test-case.js';

describe('Certificate_open_file', () => {
    const { filePath } = useTestCase();

    test('open_file_with_pem_contents', () => {
        const filename = filePath('FIEL_AAA010101AAA/certificate.cer.pem');
        const certificate = Certificate.openFile(filename);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('open_file_with_der_contents', () => {
        const filename = filePath('FIEL_AAA010101AAA/certificate.cer');
        const certificate = Certificate.openFile(filename);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });
});
