import { EOL } from 'node:os';
import { useTestCase } from '../test-case';
import { PemExtractor } from 'src/pem-extractor';

describe('PemExtractor', () => {
    const { fileContents } = useTestCase();

    test('extractor_with_empty_content', () => {
        const extractor = new PemExtractor('');

        expect(extractor.getContents()).toBe('');
        expect(extractor.extractCertificate()).toBe('');
        expect(extractor.extractPublicKey()).toBe('');
        expect(extractor.extractPrivateKey()).toBe('');
    });

    test.each([
        ['CRLF', '\r\n'],
        ['LF', '\n'],
    ])('extractor_with_fake_content_%s', (_name: string, eol: string) => {
        const content = [
            '-----BEGIN OTHER SECTION-----',
            'OTHER SECTION',
            '-----END OTHER SECTION-----',
            '-----BEGIN CERTIFICATE-----',
            'FOO+CERTIFICATE',
            '-----END CERTIFICATE-----',
            '-----BEGIN PUBLIC KEY-----',
            'FOO+PUBLIC+KEY',
            '-----END PUBLIC KEY-----',
            '-----BEGIN PRIVATE KEY-----',
            'FOO+PRIVATE+KEY',
            '-----END PRIVATE KEY-----',
        ].join(eol);
        const extractor = new PemExtractor(content);

        expect(extractor.getContents()).toBe(content);
        expect(extractor.extractCertificate()).toContain('FOO+CERTIFICATE');
        expect(extractor.extractPublicKey()).toContain('FOO+PUBLIC+KEY');
        expect(extractor.extractPrivateKey()).toContain('FOO+PRIVATE+KEY');
    });

    test('extract_certificate_with_public_key', () => {
        const contents = fileContents('CSD01_AAA010101AAA/certificate_public_key.pem');
        const extractor = new PemExtractor(contents);

        expect(extractor.getContents()).toBe(contents);
        expect(extractor.extractPublicKey()).toContain('PUBLIC KEY');
        expect(extractor.extractCertificate()).toContain('CERTIFICATE');
    });

    test('extract_private_key', () => {
        const contents = fileContents('CSD01_AAA010101AAA/private_key.key.pem');
        const extractor = new PemExtractor(contents);

        expect(extractor.extractPrivateKey()).toContain('PRIVATE KEY');
    });

    test('using_binary_file_extract_nothing', () => {
        const contents = fileContents('CSD01_AAA010101AAA/private_key.key');
        const extractor = new PemExtractor(contents);

        expect(extractor.extractCertificate()).toBe('');
        expect(extractor.extractPublicKey()).toBe('');
        expect(extractor.extractPrivateKey()).toBe('');
    });

    test('using_all_in_one_pem_contents', () => {
        const contents = fileContents('CSD01_AAA010101AAA/all_in_one.pem');
        const extractor = new PemExtractor(contents);

        expect(extractor.extractPrivateKey()).toContain('PRIVATE KEY');
        expect(extractor.extractCertificate()).toContain('CERTIFICATE');
    });

    test('extract_rsa_private_key_without_headers', () => {
        const contents = [
            '-----BEGIN RSA PRIVATE KEY-----',
            'FOO+RSA+PRIVATE+KEY',
            '-----END RSA PRIVATE KEY-----',
        ].join(EOL);
        const extractor = new PemExtractor(contents);

        expect(extractor.extractPrivateKey()).toContain('FOO+RSA+PRIVATE+KEY');
    });
});
