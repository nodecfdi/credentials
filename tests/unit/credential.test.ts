import { TestCase } from '../test-case';
import { Certificate } from '~/certificate';
import { PrivateKey } from '~/private-key';
import { Credential } from '~/credential';

describe('Credential', () => {
    test('create with matching values', () => {
        const certificate = Certificate.openFile(TestCase.filePath('FIEL_AAA010101AAA/certificate.cer'));
        const privateKey = PrivateKey.openFile(TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
        const fiel = new Credential(certificate, privateKey);

        expect(fiel.certificate()).toBe(certificate);
        expect(fiel.privateKey()).toBe(privateKey);
    });

    test('create with unmatched values', () => {
        const certificate = Certificate.openFile(TestCase.filePath('CSD01_AAA010101AAA/certificate.cer'));
        const privateKey = PrivateKey.openFile(TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');

        const t = (): Credential => {
            return new Credential(certificate, privateKey);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Certificate does not belong to private key');
    });

    test('create with files', () => {
        const fiel = Credential.openFiles(
            TestCase.filePath('FIEL_AAA010101AAA/certificate.cer'),
            TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem'),
            TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim()
        );

        expect(fiel.isFiel()).toBeTruthy();
    });

    test('create credential with contents', () => {
        const fiel = Credential.create(
            TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer'),
            TestCase.fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem'),
            TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim()
        );

        expect(fiel.isFiel()).toBeTruthy();
    });

    test('shortcuts', () => {
        const credential = Credential.openFiles(
            TestCase.filePath('CSD01_AAA010101AAA/certificate.cer'),
            TestCase.filePath('CSD01_AAA010101AAA/private_key_protected.key.pem'),
            TestCase.fileContents('CSD01_AAA010101AAA/password.txt').trim()
        );

        expect(credential.isCsd()).toBeTruthy();
        expect(credential.isFiel()).toBeFalsy();

        expect(credential.rfc()).toBe(credential.certificate().rfc());
        expect(credential.legalName()).toBe(credential.certificate().legalName());

        const textToSign = 'The quick brown fox jumps over the lazy dog';
        const signature = credential.sign(textToSign);

        expect(signature).not.toBe('');
        expect(credential.verify(textToSign, signature)).toBeTruthy();
    });
});
