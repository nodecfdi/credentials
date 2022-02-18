import { TestCase } from '../test-case';
import { PublicKey, PrivateKey, SignatureAlgorithm } from '../../src';
import { EOL } from 'os';

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

        expect.hasAssertions();
        try {
            new PublicKey(contents);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'Cannot open public key: not supported argument');
        }
    });

    test('verify', () => {
        const privateKey = PrivateKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/private_key.key.pem'), '');
        const sourceString = 'The quick brown fox jumps over the lazy dog';
        const signature = privateKey.sign(sourceString);

        expect(signature).not.toBe('');

        const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));

        expect(publicKey.verify(sourceString, signature)).toBeTruthy();
        expect(publicKey.verify(`${sourceString}${EOL}`, signature)).toBeFalsy();
        expect(publicKey.verify(sourceString, signature, SignatureAlgorithm.SHA512withRSA)).toBeFalsy();
    });
});
