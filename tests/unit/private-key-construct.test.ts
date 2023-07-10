import { useTestCase } from '../test-case';
import { PrivateKey } from 'src/private-key';

describe('PrivateKey_construct', () => {
    const { fileContents, filePath } = useTestCase();

    test('construct_with_valid_content', () => {
        const content = fileContents('FIEL_AAA010101AAA/private_key.key.pem');
        const privateKey = new PrivateKey(content, '');

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open_file_unprotected', () => {
        const filename = filePath('FIEL_AAA010101AAA/private_key.key.pem');
        const privateKey = PrivateKey.openFile(filename, '');

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open_file_with_valid_password', () => {
        const password = fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
        const privateKey = PrivateKey.openFile(filename, password);

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open_file_with_invalid_password', () => {
        const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

        const t = (): PrivateKey => PrivateKey.openFile(filename, '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot open private key');
    });

    test('construct_with_empty_content', () => {
        const t = (): PrivateKey => new PrivateKey('', '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Private key is empty');
    });

    test('construct_with_invalid_content', () => {
        const t = (): PrivateKey => new PrivateKey('invalid content', '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot open private key: Too few bytes to read ASN.1 value.');
    });

    test('construct_with_invalid_but_base64_content', () => {
        const t = (): PrivateKey => new PrivateKey('INVALID+CONTENT', '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot open private key: Too few bytes to read ASN.1 value.');
    });

    test('construct_with_pkcs8Encrypted', () => {
        const content = fileContents('CSD01_AAA010101AAA/private_key.key');
        const password = fileContents('CSD01_AAA010101AAA/password.txt').trim();
        const privateKey = new PrivateKey(content, password);

        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('construct_with_pkcs8unencrypted', () => {
        const content = fileContents('CSD01_AAA010101AAA/private_key_plain.key');
        const privateKey = new PrivateKey(content, '');
        expect(privateKey.numberOfBits()).toBeGreaterThan(0);
    });
});
