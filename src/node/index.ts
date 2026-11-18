import type { AlgorithmPfx } from '../types';
import { Buffer } from 'node:buffer';
import { writeFileSync } from 'node:fs';
import Certificate from '../certificate';
import Credential from '../credential';
import PfxExporter from '../pfx/pfx_exporter';
import PfxReader from '../pfx/pfx_reader';
import PrivateKey from '../private_key';
import PublicKey from '../public_key';
import { localFileOpen } from './local_file_open';

export { localFileOpen } from './local_file_open';

/**
 * Create a Certificate object by opening a local file.
 * The content file can be a certificate format X.509 PEM, X.509 DER or X.509 DER base64.
 *
 * This function only works in Node.js.
 */
export function openCertificateFile(filename: string): Certificate {
  return new Certificate(localFileOpen(filename));
}

/**
 * Create a PrivateKey object by opening a local file.
 * The content file can be a PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM.
 *
 * This function only works in Node.js.
 */
export function openPrivateKeyFile(filename: string, passPhrase: string): PrivateKey {
  return new PrivateKey(localFileOpen(filename), passPhrase);
}

/**
 * Create a PublicKey object by opening a local file.
 *
 * This function only works in Node.js.
 */
export function openPublicKeyFile(filename: string): PublicKey {
  return new PublicKey(localFileOpen(filename));
}

/**
 * Create a Credential object based on local files.
 *
 * File paths must be local, can have no schema or file:// schema.
 * The certificate file content can be X.509 PEM, X.509 DER or X.509 DER base64.
 * The private key content can be PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM.
 *
 * This function only works in Node.js.
 */
export function openCredentialFiles(
  certificateFile: string,
  privateKeyFile: string,
  passPhrase: string,
): Credential {
  const certificate = openCertificateFile(certificateFile);
  const privateKey = openPrivateKeyFile(privateKeyFile, passPhrase);

  return new Credential(certificate, privateKey);
}

/**
 * Create a Credential object by opening a local PFX (PKCS#12) file.
 *
 * This function only works in Node.js.
 */
export function readPfxFile(filename: string, passPhrase: string): Credential {
  return PfxReader.createCredentialFromContents(localFileOpen(filename), passPhrase);
}

/**
 * Export a Credential (or PfxExporter) to a local PFX (PKCS#12) file.
 *
 * This function only works in Node.js.
 */
export function exportPfxToFile(
  credentialOrExporter: Credential | PfxExporter,
  pfxFile: string,
  passPhrase: string,
  algorithm?: AlgorithmPfx,
): void {
  const exporter = credentialOrExporter instanceof PfxExporter
    ? credentialOrExporter
    : new PfxExporter(credentialOrExporter);
  const data = new Uint8Array(Buffer.from(exporter.export(passPhrase, algorithm), 'binary'));
  writeFileSync(pfxFile, data);
}
