import PrivateKey from '#src/node/private_key';
import { fileContents, filePath } from '../test_utils.js';

describe('private key construct', () => {
  test('construct with valid content', () => {
    const content = fileContents('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = new PrivateKey(content, '');

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file unprotected', () => {
    const filename = filePath('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = PrivateKey.openFile(filename, '');

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file with valid password', () => {
    const password = fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
    const privateKey = PrivateKey.openFile(filename, password);

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('open file with invalid password', () => {
    const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

    const t = (): PrivateKey => PrivateKey.openFile(filename, '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot open private key');
  });

  test('construct with empty content', () => {
    const t = (): PrivateKey => new PrivateKey('', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Private key is empty');
  });

  test('construct with invalid content', () => {
    const t = (): PrivateKey => new PrivateKey('invalid content', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot open private key: Too few bytes to read ASN.1 value.');
  });

  test('construct with invalid but base64 content', () => {
    const t = (): PrivateKey => new PrivateKey('INVALID+CONTENT', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot open private key: Too few bytes to read ASN.1 value.');
  });

  test('construct with pkcs8Encrypted', () => {
    const content = fileContents('CSD01_AAA010101AAA/private_key.key');
    const password = fileContents('CSD01_AAA010101AAA/password.txt').trim();
    const privateKey = new PrivateKey(content, password);

    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });

  test('construct with pkcs8unencrypted', () => {
    const content = fileContents('CSD01_AAA010101AAA/private_key_plain.key');
    const privateKey = new PrivateKey(content, '');
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
});
