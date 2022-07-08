import { Mixin } from 'ts-mixer';
import { LocalFileOpenTrait } from '~/internal/local-file-open-trait';

export class LocalFileOpenTraitSpecimen extends Mixin(LocalFileOpenTrait) {
    public localFileOpen(filename: string): string {
        return LocalFileOpenTrait.localFileOpen(filename);
    }
}
