import { EOL } from 'os';
import { TestCase } from '../test-case';
import { PublicKey } from '~/public-key';
import { PrivateKey } from '~/private-key';
import { SignatureAlgorithm } from '~/signature-algorithm';

describe('PublicKey', () => {
    test('create public key from certificate', () => {
        const contents = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
        const publicKey = new PublicKey(contents);

        expect(publicKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('open file', () => {
        const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));

        expect(publicKey.numberOfBits()).toBeGreaterThan(0);
    });

    test('create public key with invalid data', () => {
        const contents = 'invalid data';

        const t = (): PublicKey => {
            return new PublicKey(contents);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot open public key');
    });

    test('verify', () => {
        const privateKey = PrivateKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/private_key.key.pem'), '');
        const sourceString = 'The quick brown fox jumps over the lazy dog';
        const signature = privateKey.sign(sourceString);

        expect(signature).not.toBe('');

        const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));

        expect(publicKey.verify(sourceString, signature)).toBeTruthy();
        expect(publicKey.verify(`${sourceString}${EOL}`, signature)).toBeFalsy();
        expect(publicKey.verify(sourceString, signature, SignatureAlgorithm.SHA512)).toBeFalsy();
    });

    test('verify with error', () => {
        const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));

        const t = (): boolean => {
            return publicKey.verify('', '', 'sha512' as SignatureAlgorithm);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Verify error');
    });
});
