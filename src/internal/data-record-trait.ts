import { DateTime } from 'luxon';

export type ScalarType = string | number | boolean;

export abstract class DataRecordTrait {
    /** content of X509_parse or pkey_get_details */
    protected dataRecord!: Record<string, unknown>;

    protected extractScalar(key: string, defaultValue: ScalarType): ScalarType {
        const value = this.dataRecord[key] ?? defaultValue;
        if (/boolean|number|string/.test(typeof value)) {
            return value as ScalarType;
        }

        return defaultValue;
    }

    protected extractString(key: string): string {
        return `${this.extractScalar(key, '')}`;
    }

    protected extractInteger(key: string): number {
        const value = this.extractScalar(key, 0);
        if (!Number.isNaN(Number(value))) {
            return Math.floor(Number(value));
        }

        return 0;
    }

    protected extractObject(key: string): Record<string, unknown> {
        const data = this.dataRecord[key] ?? null;
        if (!data || typeof data !== 'object') {
            return {};
        }

        return data as Record<string, unknown>;
    }

    protected extractObjectStrings(key: string): Record<string, string> {
        const objectData: Record<string, string> = {};
        Object.entries(this.extractObject(key)).forEach(([name, value]) => {
            if (/boolean|number|string/.test(typeof value) || typeof value == 'object') {
                objectData[name] = `${value}`;
            }
        });

        return objectData;
    }

    protected extractDateTime(key: string): DateTime {
        return DateTime.fromMillis(this.extractInteger(key) * 1000);
    }
}
