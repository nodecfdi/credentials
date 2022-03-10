import { DataRecordTrait } from '../../../src';
import { DateTime } from 'luxon';

/**
 * @mixes DataRecordTrait
 */
class DataRecordTraitSpecimen extends DataRecordTrait {
    constructor(dataRecord: Record<string, unknown>) {
        super();
        this.dataRecord = dataRecord;
    }

    public extractString(key: string): string {
        return super.extractString(key);
    }

    public extractInteger(key: string): number {
        return super.extractInteger(key);
    }

    public extractDateTime(key: string): DateTime {
        return super.extractDateTime(key);
    }

    public extractObject(key: string): Record<string, unknown> {
        return super.extractObject(key);
    }

    public extractObjectString(key: string): Record<string, string> {
        return super.extractObjectStrings(key);
    }
}

export { DataRecordTraitSpecimen };
