import { Mixin } from 'ts-mixer';
import PublicKeyBase from '../base/public_key';
import LocalFileOpen from '../internal/local_file_open';

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
    return new PublicKey(this.localFileOpen(filename));
  }
}
