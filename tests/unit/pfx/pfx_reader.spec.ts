import CredentialBase from '#src/base/credential';
import type Credential from '#src/node/credential';
import PfxReader from '#src/node/pfx/pfx_reader';
import { fileContents, filePath } from '../../test_utils.js';

describe('pfx reader', () => {
  const obtainKnownCredential = (): Credential =>
    PfxReader.createCredentialFromFile(
      filePath('CSD01_AAA010101AAA/credential_unprotected.pfx'),
      '',
    );

  test.each([
    ['CSD01_AAA010101AAA/credential_unprotected.pfx', ''],
    ['CSD01_AAA010101AAA/credential_protected.pfx', 'CSD01_AAA010101AAA/password.txt'],
  ])('create credential from file', (dir, passPhrasePath) => {
    const passPhrase = passPhrasePath === '' ? '' : fileContents(passPhrasePath);
    const expectedCsd = obtainKnownCredential();
    const csd = PfxReader.createCredentialFromFile(filePath(dir), passPhrase);

    expect(csd).toBeInstanceOf(CredentialBase);
    expect(csd.certificate().pem()).toBe(expectedCsd.certificate().pem());
    expect(csd.privateKey().pem()).toBe(expectedCsd.privateKey().pem());
  });

  test('create credential empty contents', () => {
    const t = (): Credential => PfxReader.createCredentialFromContents('', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot create credential from empty PFX contents');
  });

  test('create credential wrong content', () => {
    const t = (): Credential => PfxReader.createCredentialFromContents('invalid-contents', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid PKCS#12 contents or wrong passphrase');
  });

  test('create credential wrong password', () => {
    const t = (): Credential =>
      PfxReader.createCredentialFromFile(
        filePath('CSD01_AAA010101AAA/credential_protected.pfx'),
        'wrong-password',
      );

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid PKCS#12 contents or wrong passphrase');
  });
});
