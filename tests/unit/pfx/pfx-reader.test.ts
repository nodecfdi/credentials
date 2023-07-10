import { useTestCase } from '../../test-case.js';
import { Credential } from 'src/credential';
import { PfxReader } from 'src/pfx/pfx-reader';

describe('Pfx_Reader', () => {
    const { fileContents, filePath } = useTestCase();

    const obtainKnownCredential = (): Credential =>
        PfxReader.createCredentialFromFile(
            filePath('CSD01_AAA010101AAA/credential_unprotected.pfx'),
            ''
        );

    test.each([
        ['CSD01_AAA010101AAA/credential_unprotected.pfx', ''],
        [
            'CSD01_AAA010101AAA/credential_protected.pfx',
            'CSD01_AAA010101AAA/password.txt',
        ],
    ])('create_credential_from_file', (dir, passPhrasePath) => {
        const passPhrase =
            passPhrasePath === '' ? '' : fileContents(passPhrasePath);
        const expectedCsd = obtainKnownCredential();
        const csd = PfxReader.createCredentialFromFile(
            filePath(dir),
            passPhrase
        );

        expect(csd).toBeInstanceOf(Credential);
        expect(csd.certificate().pem()).toBe(expectedCsd.certificate().pem());
        expect(csd.privateKey().pem()).toBe(expectedCsd.privateKey().pem());
    });

    test('create_credential_empty_contents', () => {
        const t = (): Credential =>
            PfxReader.createCredentialFromContents('', '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot create credential from empty PFX contents');
    });

    test('create_credential_wrong_content', () => {
        const t = (): Credential =>
            PfxReader.createCredentialFromContents('invalid-contents', '');

        expect(t).toThrow(Error);
        expect(t).toThrow('Invalid PKCS#12 contents or wrong passphrase');
    });

    test('create_credential_wrong_password', () => {
        const t = (): Credential =>
            PfxReader.createCredentialFromFile(
                filePath('CSD01_AAA010101AAA/credential_protected.pfx'),
                'wrong-password'
            );

        expect(t).toThrow(Error);
        expect(t).toThrow('Invalid PKCS#12 contents or wrong passphrase');
    });
});
