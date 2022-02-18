import { delegate } from 'typescript-mix';
import { LocalFileOpenTrait } from '../../../src/internal/local-file-open-trait';

export class LocalFileOpenTraitSpecimen {
    @delegate(LocalFileOpenTrait.localFileOpen)
    public localFileOpen!: (filename: string) => string;
}
