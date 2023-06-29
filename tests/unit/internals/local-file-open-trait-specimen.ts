import { Derive } from '@ddd-ts/traits';
import { LocalFileOpenTrait } from 'src/internal/local-file-open-trait';

export class LocalFileOpenTraitSpecimen extends Derive(LocalFileOpenTrait) {
    public constructor() {
        super({});
    }

    public localFileOpen2(filename: string): string {
        return LocalFileOpenTraitSpecimen.localFileOpen(filename);
    }
}
