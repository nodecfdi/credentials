import { Derive } from '@ddd-ts/traits';
import { DataArrayTrait } from 'src/internal/data-array-trait';
import { KeyTrait } from 'src/internal/key-trait';

export class KeySpecimen extends Derive(DataArrayTrait, KeyTrait) {}
