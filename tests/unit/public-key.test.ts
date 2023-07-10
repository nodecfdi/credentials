import { EOL } from 'node:os';
import { useTestCase } from '../test-case';
import { PrivateKey } from 'src/private-key';
import { PublicKey } from 'src/public-key';

describe('PublicKey', () => {
    const { fileContents, filePath } = useTestCase();

    test('create_public_key_from_certificate', () => {
        const contents = fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
        const publicKey = new PublicKey(contents);

        expect(publicKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open_file', () => {
        const publicKey = PublicKey.openFile(
            filePath('CSD01_AAA010101AAA/public_key.pem')
        );

        expect(publicKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('create_public_key_with_invalid_data', () => {
        const contents = 'invalid data';

        const t = (): PublicKey => new PublicKey(contents);

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot open public key');
    });

    test('verify', () => {
        const privateKey = PrivateKey.openFile(
            filePath('CSD01_AAA010101AAA/private_key.key.pem'),
            ''
        );
        const sourceString = 'The quick brown fox jumps over the lazy dog';
        const signature = privateKey.sign(sourceString);

        expect(signature).not.toBe('');

        const publicKey = PublicKey.openFile(
            filePath('CSD01_AAA010101AAA/public_key.pem')
        );

        expect(publicKey.verify(sourceString, signature)).toBeTruthy();
        expect(
            publicKey.verify(`${sourceString}${EOL}`, signature)
        ).toBeFalsy();
        expect(publicKey.verify(sourceString, signature, 'sha512')).toBeFalsy();
    });

    test('verify_with_error', () => {
        const publicKey = PublicKey.openFile(
            filePath('CSD01_AAA010101AAA/public_key.pem')
        );

        const t = (): boolean => publicKey.verify('', '', 'sha256');

        expect(t).toThrow(Error);
        expect(t).toThrow('Verify error');
    });
});
