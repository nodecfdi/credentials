import { LocalFileOpenTrait } from 'src/internal/local-file-open-trait';
import { Mixin } from 'ts-mixer';

export class LocalFileOpenTraitSpecimen extends Mixin(LocalFileOpenTrait) {
    public localFileOpen2(filename: string): string {
        return LocalFileOpenTrait.localFileOpen(filename);
    }
}
