import { Mixin } from 'ts-mixer';
import { LocalFileOpenTrait } from 'src/internal/local-file-open-trait';

export class LocalFileOpenTraitSpecimen extends Mixin(LocalFileOpenTrait) {
  public localFileOpen2(filename: string): string {
    return LocalFileOpenTrait.localFileOpen(filename);
  }
}
