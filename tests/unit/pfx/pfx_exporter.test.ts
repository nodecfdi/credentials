import type PrivateKey from '../../../src/private_key';
import { Buffer } from 'node:buffer';
import { existsSync, unlinkSync } from 'node:fs';
import { beforeEach, describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';
import Credential from '../../../src/credential';
import { exportPfxToFile, openCertificateFile, openCredentialFiles } from '../../../src/node';
import PfxExporter from '../../../src/pfx/pfx_exporter';
import PfxReader from '../../../src/pfx/pfx_reader';
import { utilities } from '../../../test_helpers/test_utilities.js';

describe('pfx exporter', () => {
  let credentialPassprase: string;
  let credential: Credential;

  beforeEach(() => {
    credentialPassprase = utilities.fileContents('CSD01_AAA010101AAA/password.txt').trim();
    credential = openCredentialFiles(
      utilities.filePath('CSD01_AAA010101AAA/certificate.cer'),
      utilities.filePath('CSD01_AAA010101AAA/private_key.key'),
      credentialPassprase,
    );
  });

  test('export to content', () => {
    const pfxExporter = new PfxExporter(credential);
    const pfxContents = pfxExporter.export('');

    expect(JSON.stringify(PfxReader.loadPkcs12(pfxContents))).toStrictEqual(
      JSON.stringify(
        PfxReader.loadPkcs12(utilities.fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
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
        PfxReader.loadPkcs12(utilities.fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
      ),
    );
  });

  test('export to file', () => {
    const filename = utilities.filePath('generated.pfx');

    exportPfxToFile(credential, filename, '');
    expect(existsSync(filename)).toBeTruthy();
    const contents = utilities.fileContents('generated.pfx');

    expect(JSON.stringify(PfxReader.loadPkcs12(contents))).toStrictEqual(
      JSON.stringify(
        PfxReader.loadPkcs12(utilities.fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
      ),
    );

    unlinkSync(filename);
  });

  test('export to file using exporter instance', () => {
    const filename = utilities.filePath('generated_from_exporter.pfx');
    const pfxExporter = new PfxExporter(credential);

    exportPfxToFile(pfxExporter, filename, '');
    expect(existsSync(filename)).toBeTruthy();
    const contents = utilities.fileContents('generated_from_exporter.pfx');

    expect(JSON.stringify(PfxReader.loadPkcs12(contents))).toStrictEqual(
      JSON.stringify(
        PfxReader.loadPkcs12(utilities.fileContents('CSD01_AAA010101AAA/credential_unprotected.pfx')),
      ),
    );

    unlinkSync(filename);
  });

  test('export with error', () => {
    const certificate = openCertificateFile(utilities.filePath('CSD01_AAA010101AAA/certificate.cer'));
    const privateKey = mock<PrivateKey>();
    privateKey.belongsTo.mockReturnValue(true);
    privateKey.callOnPrivateKey.mockImplementation(() => {
      throw new Error('Cannot open private key');
    });
    const malformedCredential = new Credential(certificate, privateKey);
    const pfxExporter = new PfxExporter(malformedCredential);

    const t = (): string => pfxExporter.export('');
    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot export credential with certificate 30001000000300023708');
  });

  test('export to base64 with error', () => {
    const certificate = openCertificateFile(utilities.filePath('CSD01_AAA010101AAA/certificate.cer'));
    const privateKey = mock<PrivateKey>();
    privateKey.belongsTo.mockReturnValue(true);
    privateKey.callOnPrivateKey.mockImplementation(() => {
      throw new Error('Cannot open private key');
    });
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
