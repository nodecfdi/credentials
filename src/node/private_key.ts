import { Mixin } from 'ts-mixer';
import PrivateKeyBase from '#src/base/private_key';
import LocalFileOpen from '#src/internal/local_file_open';

export default class PrivateKey extends Mixin(PrivateKeyBase, LocalFileOpen) {
  /**
   * Create a PrivateKey object by opening a local file
   * The content file can be a PKCS#8 DER, PKCS#8 PEM OR PKCS#5 PEM
   *
   * @param filename - file name to be read
   * @param passPhrase - if file is encrypted
   *
   * This function only works in Node.js.
   */
  public static openFile(filename: string, passPhrase: string): PrivateKey {
    return new PrivateKey(PrivateKey.localFileOpen(filename), passPhrase);
  }
}
