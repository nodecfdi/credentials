import { DateTime } from 'luxon';
import { isNumber } from '../utils/is-number.js';
import { isScalar } from '../utils/is-scalar.js';

export abstract class DataArrayTrait {
  protected declare _dataArray: Record<string, unknown>;

  protected extractScalar(
    key: string,
    valueDefault: string | number | boolean,
  ): string | number | boolean {
    const value = this._dataArray[key] ?? valueDefault;
    if (isScalar(value)) {
      return value;
    }

    return valueDefault;
  }

  protected extractString(key: string): string {
    return this.extractScalar(key, '').toString();
  }

  protected extractInteger(key: string): number {
    const value = this.extractScalar(key, 0);
    if (isNumber(value)) {
      return Math.floor(Number(value));
    }

    return 0;
  }

  protected extractArray(key: string): Record<string, unknown> {
    const data = this._dataArray[key] ?? null;
    if (!(typeof data === 'object' && data !== null)) {
      return {};
    }

    return data as Record<string, unknown>;
  }

  protected extractArrayStrings(key: string): Record<string, string> {
    const array: Record<string, string> = {};
    for (const [name, value] of Object.entries(this.extractArray(key))) {
      if (isScalar(value)) {
        array[name] = value.toString();
      }
    }

    return array;
  }

  protected extractDateTime(key: string): DateTime {
    return DateTime.fromMillis(this.extractInteger(key) * 1000);
  }
}
