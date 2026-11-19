import { describe, expect, test } from 'vitest';
import { openPrivateKeyFile } from '../../src/node';
import PrivateKey from '../../src/private_key';
import { utilities } from '../../test_helpers/test_utilities.js';

describe('private key construct', () => {
  test('construct with valid content', () => {
    const content = utilities.fileContents('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = new PrivateKey(content, '');

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file unprotected', () => {
    const filename = utilities.filePath('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = openPrivateKeyFile(filename, '');

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file with valid password', () => {
    const password = utilities.fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const filename = utilities.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
    const privateKey = openPrivateKeyFile(filename, password);

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file with invalid password', () => {
    const filename = utilities.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

    const t = (): PrivateKey => openPrivateKeyFile(filename, '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot open private key');
  });

  test.each([
    ['empty content', '', 'Private key is empty'],
    [
      'invalid content',
      'invalid content',
      'Cannot open private key: Too few bytes to read ASN.1 value.',
    ],
    [
      'invalid but base64 content',
      'INVALID+CONTENT',
      'Cannot open private key: Too few bytes to read ASN.1 value.',
    ],
  ])('construct with %s', (_name, content, expectedMessage) => {
    const t = (): PrivateKey => new PrivateKey(content, '');

    expect(t).toThrow(Error);
    expect(t).toThrow(expectedMessage);
  });

  test('construct with pkcs8Encrypted', () => {
    const content = utilities.fileContents('CSD01_AAA010101AAA/private_key.key');
    const password = utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim();
    const privateKey = new PrivateKey(content, password);

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('construct with pkcs8unencrypted', () => {
    const content = utilities.fileContents('CSD01_AAA010101AAA/private_key_plain.key');
    const privateKey = new PrivateKey(content, '');
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
});
