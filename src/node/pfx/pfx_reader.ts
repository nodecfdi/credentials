import { Mixin } from 'ts-mixer';
import PfxReaderBase from '#src/base/pfx/pfx_reader';
import LocalFileOpen from '#src/internal/local_file_open';
import type Credential from '#src/node/credential';

export default class PfxReader extends Mixin(PfxReaderBase, LocalFileOpen) {
  public static createCredentialFromFile(filename: string, passPhrase: string): Credential {
    return PfxReader.createCredentialFromContents(PfxReader.localFileOpen(filename), passPhrase);
  }
}
