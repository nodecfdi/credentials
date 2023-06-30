import { Certificate } from 'src/certificate';
import { Credential } from 'src/credential';
import { PrivateKey } from 'src/private-key';
import { useTestCase } from '../test-case.js';

describe('Credential', () => {
    const { filePath, fileContents } = useTestCase();

    test('create_with_matching_values', () => {
        const certificate = Certificate.openFile(filePath('FIEL_AAA010101AAA/certificate.cer'));
        const privateKey = PrivateKey.openFile(filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
        const fiel = new Credential(certificate, privateKey);

        expect(fiel.certificate()).toBe(certificate);
        expect(fiel.privateKey()).toBe(privateKey);
    });

    test('create_with_unmatched_values', () => {
        const certificate = Certificate.openFile(filePath('CSD01_AAA010101AAA/certificate.cer'));
        const privateKey = PrivateKey.openFile(filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');

        const t = (): Credential => {
            return new Credential(certificate, privateKey);
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('Certificate does not belong to private key');
    });

    test('create_with_files', () => {
        const fiel = Credential.openFiles(
            filePath('FIEL_AAA010101AAA/certificate.cer'),
            filePath('FIEL_AAA010101AAA/private_key_protected.key.pem'),
            fileContents('FIEL_AAA010101AAA/password.txt').trim()
        );

        expect(fiel.isFiel()).toBeTruthy();
    });

    test('create_credential_with_contents', () => {
        const fiel = Credential.create(
            fileContents('FIEL_AAA010101AAA/certificate.cer'),
            fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem'),
            fileContents('FIEL_AAA010101AAA/password.txt').trim()
        );

        expect(fiel.isFiel()).toBeTruthy();
    });

    test('shortcuts', () => {
        const credential = Credential.openFiles(
            filePath('CSD01_AAA010101AAA/certificate.cer'),
            filePath('CSD01_AAA010101AAA/private_key_protected.key.pem'),
            fileContents('CSD01_AAA010101AAA/password.txt').trim()
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
