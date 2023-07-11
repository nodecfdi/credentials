import { type DateTime } from 'luxon';
import { Mixin } from 'ts-mixer';
import { DataArrayTrait } from 'src/internal/data-array-trait';

export class DataArrayTraitSpecimen extends Mixin(DataArrayTrait) {
    constructor(dataArray: Record<string, unknown>) {
        super();
        this._dataArray = dataArray;
    }

    public extractString(key: string): string {
        return super.extractString(key);
    }

    public extractInteger(key: string): number {
        return super.extractInteger(key);
    }

    public extractArray(key: string): Record<string, unknown> {
        return super.extractArray(key);
    }

    public extractDateTime(key: string): DateTime {
        return super.extractDateTime(key);
    }

    public extractArrayStrings(key: string): Record<string, string> {
        return super.extractArrayStrings(key);
    }
}
