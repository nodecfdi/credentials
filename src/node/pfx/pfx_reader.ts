import type Credential from '../credential';
import { Mixin } from 'ts-mixer';
import PfxReaderBase from '../../base/pfx/pfx_reader';
import LocalFileOpen from '../../internal/local_file_open';

export default class PfxReader extends Mixin(PfxReaderBase, LocalFileOpen) {
  public static createCredentialFromFile(filename: string, passPhrase: string): Credential {
    return this.createCredentialFromContents(this.localFileOpen(filename), passPhrase);
  }
}
