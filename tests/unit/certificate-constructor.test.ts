import { TestCase } from '../test-case';
import { Certificate } from '~/certificate';

describe('Certificate constructor', () => {
    test('constructor with pem content', () => {
        const pem = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
        const certificate = new Certificate(pem);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('constructor with der content', () => {
        const contents = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer');
        const certificate = new Certificate(contents);

        expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
    });

    test('constructor with empty content', () => {
        const t = (): Certificate => {
            return new Certificate('');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Create certificate from empty contents');
    });

    test('constructor with invalid content', () => {
        const t = (): Certificate => {
            return new Certificate('x');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot parse X509 certificate from contents');
    });
});
