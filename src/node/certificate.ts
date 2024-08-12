import { Mixin } from 'ts-mixer';
import CertificateBase from '#src/base/certificate';
import LocalFileOpen from '#src/internal/local_file_open';

export default class Certificate extends Mixin(CertificateBase, LocalFileOpen) {
  /**
   * Create a Certificate object by opening a local file
   * The content file can be a certificate format X.509 PEM, X.509 DER or X.509 DER base64
   *
   * @param filename - file name to be read
   *
   * This function only works in Node.js.
   */
  public static openFile(filename: string): Certificate {
    return new Certificate(Certificate.localFileOpen(filename));
  }
}
