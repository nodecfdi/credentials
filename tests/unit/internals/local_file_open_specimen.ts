import { Mixin } from 'ts-mixer';
import LocalFileOpenTrait from '#src/internal/local_file_open';

export default class LocalFileOpenSpecimen extends Mixin(LocalFileOpenTrait) {
  public localFileOpen(filename: string): string {
    return LocalFileOpenTrait.localFileOpen(filename);
  }
}
