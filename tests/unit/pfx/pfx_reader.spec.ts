import { describe, expect, test } from 'vitest';
import Credential from '../../../src/credential';
import { readPfxFile } from '../../../src/node';
import PfxReader from '../../../src/pfx/pfx_reader';
import { utilities } from '../../test_utilities.js';

describe('pfx reader', () => {
  const obtainKnownCredential = (): Credential =>
    readPfxFile(
      utilities.filePath('CSD01_AAA010101AAA/credential_unprotected.pfx'),
      '',
    );

  test.each([
    ['CSD01_AAA010101AAA/credential_unprotected.pfx', ''],
    ['CSD01_AAA010101AAA/credential_protected.pfx', 'CSD01_AAA010101AAA/password.txt'],
  ])('create credential from file', (dir, passPhrasePath) => {
    const passPhrase = passPhrasePath === '' ? '' : utilities.fileContents(passPhrasePath);
    const expectedCsd = obtainKnownCredential();
    const csd = readPfxFile(utilities.filePath(dir), passPhrase);

    expect(csd).toBeInstanceOf(Credential);
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
      readPfxFile(
        utilities.filePath('CSD01_AAA010101AAA/credential_protected.pfx'),
        'wrong-password',
      );

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid PKCS#12 contents or wrong passphrase');
  });
});
