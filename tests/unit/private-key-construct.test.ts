import { TestCase } from '../test-case';
import { PrivateKey } from '../../src';

describe('PrivateKey construct', () => {
    test('construct with valid content', () => {
        const content = TestCase.fileContents('FIEL_AAA010101AAA/private_key.key.pem');
        const privateKey = new PrivateKey(content, '');

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open file unprotected', () => {
        const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem');
        const privateKey = PrivateKey.openFile(filename, '');

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open file with valid password', () => {
        const password = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
        const privateKey = PrivateKey.openFile(filename, password);

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open file with invalid password', () => {
        const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

        expect.hasAssertions();
        try {
            PrivateKey.openFile(filename, '');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Cannot open private key');
        }
    });

    test('construct with empty content', () => {
        expect.hasAssertions();
        try {
            new PrivateKey('', '');
        } catch (e) {
            expect(e).toBeInstanceOf(SyntaxError);
            expect(e).toHaveProperty('message', 'Private key is empty');
        }
    });

    test('construct with invalid content', () => {
        expect.hasAssertions();
        try {
            new PrivateKey('invalid content', '');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Cannot open private key: malformed plain PKCS8 private key(code:001)');
        }
    });

    test('construct with invalid but base64 content', () => {
        expect.hasAssertions();
        try {
            new PrivateKey('INVALID+CONTENT', '');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Cannot open private key: malformed plain PKCS8 private key(code:001)');
        }
    });

    test('construct with pkcs8Encrypted', () => {
        const content = TestCase.fileContents('CSD01_AAA010101AAA/private_key.key');
        const password = TestCase.fileContents('CSD01_AAA010101AAA/password.txt').trim();
        const privateKey = new PrivateKey(content, password);

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('construct with pkcs8unencrypted', () => {
        const content = TestCase.fileContents('CSD01_AAA010101AAA/private_key_plain.key');
        const privateKey = new PrivateKey(content, '');
        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });
});
