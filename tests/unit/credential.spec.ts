import { describe, expect, test } from 'vitest';
import Certificate from '../../src/node/certificate';
import Credential from '../../src/node/credential';
import PrivateKey from '../../src/node/private_key';
import { utilities } from '../test_utilities.js';

describe('credential', () => {
  test('create with matching values', () => {
    const certificate = Certificate.openFile(utilities.filePath('FIEL_AAA010101AAA/certificate.cer'));
    const privateKey = PrivateKey.openFile(utilities.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
    const fiel = new Credential(certificate, privateKey);

    expect(fiel.certificate()).toBe(certificate);
    expect(fiel.privateKey()).toBe(privateKey);
  });

  test('create with unmatched values', () => {
    const certificate = Certificate.openFile(utilities.filePath('CSD01_AAA010101AAA/certificate.cer'));
    const privateKey = PrivateKey.openFile(utilities.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');

    const t = (): Credential => new Credential(certificate, privateKey);

    expect(t).toThrow(Error);
    expect(t).toThrow('Certificate does not belong to private key');
  });

  test('create with files', () => {
    const fiel = Credential.openFiles(
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
    const credential = Credential.openFiles(
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
