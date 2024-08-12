import { Mixin } from 'ts-mixer';
import PublicKeyBase from '#src/base/public_key';
import LocalFileOpen from '#src/internal/local_file_open';

export default class PublicKey extends Mixin(PublicKeyBase, LocalFileOpen) {
  /**
   * Read file and return PublicKey instance
   *
   * @param filename - file name to be read
   * @returns PublicKey instance
   *
   * This function only works in Node.js.
   */
  public static openFile(filename: string): PublicKey {
    return new PublicKey(PublicKey.localFileOpen(filename));
  }
}
