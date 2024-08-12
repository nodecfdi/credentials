import { Buffer } from 'node:buffer';
import { mock } from 'vitest-mock-extended';
import PfxExporter from '#src/base/pfx/pfx_exporter';
import PfxReader from '#src/base/pfx/pfx_reader';
import type PrivateKey from '#src/base/private_key';
import Certificate from '#src/node/certificate';
import Credential from '#src/node/credential';
import { fileContents, filePath } from '../../test_utils.js';

describe('pfx exporter', () => {
  let credentialPassprase: string;
  let credential: Credential;

  beforeEach(() => {
    credentialPassprase = fileContents('CSD01_AAA010101AAA/password.txt').trim();
    credential = Credential.openFiles(
      filePath('CSD01_AAA010101AAA/certificate.cer'),
      filePath('CSD01_AAA010101AAA/private_key.key'),
      credentialPassprase,
    );
  });

  test('export to content', () => {
    const pfxExporter = new PfxExporter(credential);
    const pfxContents = pfxExporter.export('');

    expect(JSON.stringify(PfxReader.loadPkcs12(pfxContents))).toStrictEqual(
      JSON.stringify(
        PfxReader.loadPkcs12(fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
      ),
    );
  });

  test('export to base64', () => {
    const pfxExporter = new PfxExporter(credential);
    const pfxBase64 = pfxExporter.exportToBase64('');

    expect(
      JSON.stringify(PfxReader.loadPkcs12(Buffer.from(pfxBase64, 'base64').toString('binary'))),
    ).toStrictEqual(
      JSON.stringify(
        PfxReader.loadPkcs12(fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
      ),
    );
  });

  test('export with error', () => {
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

  test('export to base64 with error', () => {
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

  test('get credential', () => {
    const pfxExporter = new PfxExporter(credential);

    expect(pfxExporter.getCredential()).toBe(credential);
  });
});
