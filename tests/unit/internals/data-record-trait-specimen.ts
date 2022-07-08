import { DataRecordTrait } from '~/internal/data-record-trait';
import { DateTime } from 'luxon';

class DataRecordTraitSpecimen extends DataRecordTrait {
    constructor(dataRecord: Record<string, unknown>) {
        super();
        this.dataRecord = dataRecord;
    }

    public override extractString(key: string): string {
        return super.extractString(key);
    }

    public override extractInteger(key: string): number {
        return super.extractInteger(key);
    }

    public override extractDateTime(key: string): DateTime {
        return super.extractDateTime(key);
    }

    public override extractObject(key: string): Record<string, unknown> {
        return super.extractObject(key);
    }

    public override extractObjectStrings(key: string): Record<string, string> {
        return super.extractObjectStrings(key);
    }
}

export { DataRecordTraitSpecimen };
