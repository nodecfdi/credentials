import { describe, expect, test } from 'vitest';
import Credential from '../../src/credential';
import { openCertificateFile, openCredentialFiles, openPrivateKeyFile } from '../../src/node';
import { utilities } from '../../test_helpers/test_utilities.js';

describe('credential', () => {
  test('create with matching values', () => {
    const certificate = openCertificateFile(utilities.filePath('FIEL_AAA010101AAA/certificate.cer'));
    const privateKey = openPrivateKeyFile(utilities.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
    const fiel = new Credential(certificate, privateKey);

    expect(fiel.certificate()).toBe(certificate);
    expect(fiel.privateKey()).toBe(privateKey);
  });

  test('create with unmatched values', () => {
    const certificate = openCertificateFile(utilities.filePath('CSD01_AAA010101AAA/certificate.cer'));
    const privateKey = openPrivateKeyFile(utilities.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');

    const t = (): Credential => new Credential(certificate, privateKey);

    expect(t).toThrow(Error);
    expect(t).toThrow('Certificate does not belong to private key');
  });

  test('create with files', () => {
    const fiel = openCredentialFiles(
      utilities.filePath('FIEL_AAA010101AAA/certificate.cer'),
      utilities.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem'),
      utilities.fileContents('FIEL_AAA010101AAA/password.txt').trim(),
    );

    expect(fiel.isFiel()).toBeTruthy();
  });

  test('create credential with contents', () => {
    const fiel = Credential.create(
      utilities.fileContents('FIEL_AAA010101AAA/certificate.cer'),
      utilities.fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem'),
      utilities.fileContents('FIEL_AAA010101AAA/password.txt').trim(),
    );

    expect(fiel.isFiel()).toBeTruthy();
  });

  test('shortcuts', () => {
    const credential = openCredentialFiles(
      utilities.filePath('CSD01_AAA010101AAA/certificate.cer'),
      utilities.filePath('CSD01_AAA010101AAA/private_key_protected.key.pem'),
      utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim(),
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
