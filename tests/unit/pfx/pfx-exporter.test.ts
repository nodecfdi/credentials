import { Buffer } from 'node:buffer';
import { mock } from 'vitest-mock-extended';
import { useTestCase } from '../../test-case';
import { Certificate } from 'src/certificate';
import { Credential } from 'src/credential';
import { PfxExporter } from 'src/pfx/pfx-exporter';
import { PfxReader } from 'src/pfx/pfx-reader';
import { type PrivateKey } from 'src/private-key';

describe('Pfx_Exporter', () => {
    const { fileContents, filePath } = useTestCase();

    let credentialPassprase: string;
    let credential: Credential;

    beforeEach(() => {
        credentialPassprase = fileContents('CSD01_AAA010101AAA/password.txt').trim();
        credential = Credential.openFiles(
            filePath('CSD01_AAA010101AAA/certificate.cer'),
            filePath('CSD01_AAA010101AAA/private_key.key'),
            credentialPassprase
        );
    });

    test('export_to_content', () => {
        const pfxExporter = new PfxExporter(credential);
        const pfxContents = pfxExporter.export('');

        expect(JSON.stringify(PfxReader.loadPkcs12(pfxContents))).toEqual(
            JSON.stringify(PfxReader.loadPkcs12(fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')))
        );
    });

    test('export_to_base64', () => {
        const pfxExporter = new PfxExporter(credential);
        const pfxBase64 = pfxExporter.exportToBase64('');

        expect(JSON.stringify(PfxReader.loadPkcs12(Buffer.from(pfxBase64, 'base64').toString('binary')))).toEqual(
            JSON.stringify(PfxReader.loadPkcs12(fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')))
        );
    });

    test('export_with_error', () => {
        const certificate = Certificate.openFile(filePath('CSD01_AAA010101AAA/certificate.cer'));
        const privateKey = mock<PrivateKey>();
        privateKey.belongsTo.mockReturnValue(true);
        privateKey.pem.mockReturnValue('bar');
        privateKey.passPhrase.mockReturnValue('baz');
        const malformedCredential = new Credential(certificate, privateKey);
        const pfxExporter = new PfxExporter(malformedCredential);

        const t = (): string => pfxExporter.export('');
        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot export credential with certificate 30001000000300023708');
    });

    test('export_to_base64_with_error', () => {
        const certificate = Certificate.openFile(filePath('CSD01_AAA010101AAA/certificate.cer'));
        const privateKey = mock<PrivateKey>();
        privateKey.belongsTo.mockReturnValue(true);
        privateKey.pem.mockReturnValue('bar');
        privateKey.passPhrase.mockReturnValue('baz');
        const malformedCredential = new Credential(certificate, privateKey);
        const pfxExporter = new PfxExporter(malformedCredential);

        const t = (): string => pfxExporter.exportToBase64('');
        expect(t).toThrow(Error);
        expect(t).toThrow('Cannot export credential with certificate 30001000000300023708');
    });

    test('get_credential', () => {
        const pfxExporter = new PfxExporter(credential);

        expect(pfxExporter.getCredential()).toBe(credential);
    });
});
