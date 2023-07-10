import { BaseConverter } from '@nodecfdi/base-converter';

/**
 * This class is used to load hexadecimal or decimal data as a certificate serial number.
 * It has its own class because SOLID and is easy to test in this way.
 * It is not intended to use in general.
 */
export class SerialNumber {
    /** Hexadecimal string representation */
    private readonly _hexadecimal: string;

    constructor(hexadecimal: string) {
        if (hexadecimal === '') {
            throw new Error('The hexadecimal string is empty');
        }

        if ('0x'.toLowerCase() === hexadecimal.slice(0, 2).toLowerCase()) {
            hexadecimal = hexadecimal.slice(2);
        }

        if (!/^[\da-f]*$/.test(hexadecimal)) {
            throw new Error(
                'The hexadecimal string contains invalid characters'
            );
        }

        this._hexadecimal = hexadecimal;
    }

    public static createFromHexadecimal(hexadecimal: string): SerialNumber {
        return new SerialNumber(hexadecimal);
    }

    public static createFromDecimal(decString: string): SerialNumber {
        const hexadecimal = BaseConverter.createBase36().convert(
            decString,
            10,
            16
        );

        return new SerialNumber(hexadecimal);
    }

    public static createFromBytes(input: string): SerialNumber {
        const hexadecimal = (input.match(/./g) ?? [])
            .map((value) => {
                const fixedNumber = value.codePointAt(0) ?? 0;

                return Number.parseInt(`${fixedNumber}`, 10).toString(16);
            })
            .join('');

        return new SerialNumber(hexadecimal);
    }

    public hexadecimal(): string {
        return this._hexadecimal;
    }

    public bytes(): string {
        return (this._hexadecimal.match(/.{1,2}/g) ?? [])
            .map((value) => {
                const fixedValue = value.replaceAll(/[^\da-f]/gi, '');
                const fixedNumber = Number.parseInt(fixedValue, 16);

                return String.fromCodePoint(fixedNumber);
            })
            .join('');
    }

    public decimal(): string {
        return BaseConverter.createBase36().convert(this.hexadecimal(), 16, 10);
    }
}
