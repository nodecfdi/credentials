import { Certificate } from 'src/certificate';
import { PrivateKey } from 'src/private-key';
import { useTestCase } from '../test-case.js';

describe('PrivateKey', () => {
    const { fileContents, filePath } = useTestCase();

    const createPrivateKey = (): PrivateKey => {
        const password = fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

        return PrivateKey.openFile(filename, password);
    };

    test('pem_and_passPhrase_properties', () => {
        const passPhrase = fileContents('FIEL_AAA010101AAA/password.txt').trim();
        const contents = fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem');
        const privateKey = new PrivateKey(contents, passPhrase);

        expect(privateKey.pem().includes(contents)).toBeTruthy();
        expect(privateKey.pem().startsWith('-----BEGIN RSA PRIVATE KEY-----')).toBeTruthy();
        expect(privateKey.pem().replaceAll('\n', '').endsWith('-----END RSA PRIVATE KEY-----')).toBeTruthy();
        expect(privateKey.passPhrase()).toEqual(passPhrase);
    });

    test('public_key_is_the_same_as_in_certificate', () => {
        const certFile = filePath('FIEL_AAA010101AAA/certificate.cer');
        const certificate = Certificate.openFile(certFile);
        const privateKey = createPrivateKey();
        const publicKey = privateKey.publicKey();

        expect(certificate.publicKey().parsed().key).toBe(publicKey.parsed().key);
        expect(privateKey.publicKey().parsed().key).toBe(publicKey.parsed().key);
    });

    test('sign_sha512', () => {
        const privateKey = createPrivateKey();
        const sourceString = 'the quick brown fox jumps over the lazy dog';
        const signature = privateKey.sign(sourceString, 'sha512');

        expect(signature).not.toBe('');

        const publicKey = privateKey.publicKey();
        expect(publicKey.verify(sourceString, signature, 'sha512')).toBeTruthy();
    });

    test('sign_dont_set_signature', () => {
        const privateKey = createPrivateKey();
        const sourceString = '';

        const t = (): string => {
            return privateKey.sign(sourceString, 'sha1');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot sign data: empty signature');
    });

    test.each([
        ['paired_certificate', 'FIEL_AAA010101AAA/certificate.cer', true],
        ['other_certificate', 'CSD01_AAA010101AAA/certificate.cer', false],
    ])('belongs_to_%s', (_name: string, filename: string, expectBelongsTo: boolean) => {
        const certificate = Certificate.openFile(filePath(filename));
        const privateKey = createPrivateKey();
        expect(privateKey.belongsTo(certificate)).toBe(expectBelongsTo);
    });
});
