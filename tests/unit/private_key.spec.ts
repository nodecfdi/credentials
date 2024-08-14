import Certificate from '#src/node/certificate';
import PrivateKey from '#src/node/private_key';
import { fileContents, filePath } from '../test_utils.js';

describe('private key', () => {
  const createPrivateKey = (): PrivateKey => {
    const password = fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const filename = filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');

    return PrivateKey.openFile(filename, password);
  };

  const createCertificate = (): Certificate =>
    new Certificate(fileContents('FIEL_AAA010101AAA/certificate.cer'));

  test('pem and passPhrase properties', () => {
    const passPhrase = fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const contents = fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem');
    const privateKey = new PrivateKey(contents, passPhrase);

    expect(privateKey.pem().includes(contents)).toBeTruthy();
    expect(privateKey.pem().startsWith('-----BEGIN RSA PRIVATE KEY-----')).toBeTruthy();
    expect(
      privateKey.pem().replaceAll('\n', '').endsWith('-----END RSA PRIVATE KEY-----'),
    ).toBeTruthy();
    expect(privateKey.passPhrase()).toStrictEqual(passPhrase);
  });

  test('public key is the same as in certificate', () => {
    const certFile = filePath('FIEL_AAA010101AAA/certificate.cer');
    const certificate = Certificate.openFile(certFile);
    const privateKey = createPrivateKey();
    const publicKey = privateKey.publicKey();

    expect(certificate.publicKey().parsed().key).toBe(publicKey.parsed().key);
    expect(privateKey.publicKey().parsed().key).toBe(publicKey.parsed().key);
  });

  test('sign sha512', () => {
    const privateKey = createPrivateKey();
    const sourceString = 'the quick brown fox jumps over the lazy dog';
    const signature = privateKey.sign(sourceString, 'sha512');

    expect(signature).not.toBe('');

    const publicKey = privateKey.publicKey();
    expect(publicKey.verify(sourceString, signature, 'sha512')).toBeTruthy();
  });

  test('sign dont set signature', () => {
    const privateKey = createPrivateKey();
    const sourceString = '';

    const t = (): string => privateKey.sign(sourceString, 'sha1');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot sign data: empty signature');
  });

  test.each([
    ['paired certificate', 'FIEL_AAA010101AAA/certificate.cer', true],
    ['other certificate', 'CSD01_AAA010101AAA/certificate.cer', false],
  ])('belongs to %s', (_name: string, filename: string, expectBelongsTo: boolean) => {
    const certificate = Certificate.openFile(filePath(filename));
    const privateKey = createPrivateKey();
    expect(privateKey.belongsTo(certificate)).toBe(expectBelongsTo);
  });

  test.each([
    ['clear password', '', 'PRIVATE KEY'],
    ['change password', 'other password', 'ENCRYPTED PRIVATE KEY'],
  ])('change pass phrase %s', (_name, newPassword, expectedHeaderName) => {
    const certificate = createCertificate();
    const baseKey = createPrivateKey();

    const changed = baseKey.changePassPhrase(newPassword);

    expect(baseKey.pem()).not.toBe(changed.pem());
    expect(changed.belongsTo(certificate)).toBeTruthy();

    const pkcs8Header = `-----BEGIN ${expectedHeaderName}-----`;
    expect(changed.pem().startsWith(pkcs8Header)).toBeTruthy();
  });
});
