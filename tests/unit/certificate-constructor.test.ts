import { useTestCase } from '../test-case';
import { Certificate } from 'src/certificate';

describe('Certificate_constructor', () => {
    const { fileContents } = useTestCase();

    test('constructor_with_pem_content', () => {
        const pem = fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
        const certificate = new Certificate(pem);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('constructor_with_der_content', () => {
        const contents = fileContents('FIEL_AAA010101AAA/certificate.cer');
        const certificate = new Certificate(contents);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('constructor_with_empty_content', () => {
        const t = (): Certificate => new Certificate('');

        expect(t).toThrow(Error);
        expect(t).toThrow('Create certificate from empty contents');
    });

    test('constructor_with_invalid_content', () => {
        const t = (): Certificate => new Certificate('x');

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot parse X509 certificate from contents');
    });
});
