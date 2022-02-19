import { TestCase } from '../test-case';
import { PrivateKey, Certificate, SignatureAlgorithm } from '../../src';

describe('PrivateKey', () => {
    const createPrivateKey = (): PrivateKey => {
        const password = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
        return PrivateKey.openFile(filename, password);
    };

    test('pem and passPhrase properties', () => {
        const passPhrase = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const fileContents = TestCase.fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem');
        const privateKey = new PrivateKey(fileContents, passPhrase);

        expect(privateKey.pem().includes(fileContents)).toBeTruthy();
        expect(privateKey.pem().startsWith('-----BEGIN RSA PRIVATE KEY-----')).toBeTruthy();
        expect(privateKey.pem().endsWith('-----END RSA PRIVATE KEY-----')).toBeTruthy();
        expect(privateKey.passPhrase()).toEqual(passPhrase);
    });

    test('public key is the same as in certificate', () => {
        const certFile = TestCase.filePath('FIEL_AAA010101AAA/certificate.cer');
        const certificate = Certificate.openFile(certFile);
        const privateKey = createPrivateKey();
        const publicKey = privateKey.publicKey();

        expect(certificate.publicKey()).toEqual(publicKey);
        expect(privateKey.publicKey()).toStrictEqual(publicKey);
    });

    test('sign', () => {
        const privateKey = createPrivateKey();
        const sourceString = 'the quick brown fox jumps over the lazy dog';
        const signature = privateKey.sign(sourceString, SignatureAlgorithm.SHA512);

        expect(signature).not.toBe('');

        const publicKey = privateKey.publicKey();
        expect(publicKey.verify(sourceString, signature)).toBeTruthy();
    });

    test.each([
        ['paired certificate', 'FIEL_AAA010101AAA/certificate.cer', true],
        ['other certificate', 'CSD01_AAA010101AAA/certificate.cer', false],
    ])('belongs to %s', (name: string, filename: string, expectBelongsTo: boolean) => {
        const certificate = Certificate.openFile(TestCase.filePath(filename));
        const privateKey = createPrivateKey();
        expect(privateKey.belongsTo(certificate)).toBe(expectBelongsTo);
    });
});
