import { TestCase } from '../test-case';
import { Certificate } from '../../src';

describe('Certificate open file', () => {
    test('open file with pem contents', () => {
        const filename = TestCase.filePath('FIEL_AAA010101AAA/certificate.cer.pem');
        const certificate = Certificate.openFile(filename);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('open file with der contents', () => {
        const filename = TestCase.filePath('FIEL_AAA010101AAA/certificate.cer');
        const certificate = Certificate.openFile(filename);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });
});
