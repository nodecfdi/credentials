import { SerialNumber } from '~/serial-number';

describe('SerialNumber', () => {
    const SERIAL_HEXADECIMAL = '3330303031303030303030333030303233373038';
    const SERIAL_BYTES = '30001000000300023708';
    const SERIAL_DECIMAL = '292233162870206001759766198425879490508935868472';

    test.each([[''], ['0X'], ['0x']])('create from hexadecimal', (prefix) => {
        const value = `${prefix}${SERIAL_HEXADECIMAL}`;
        const serial = SerialNumber.createFromHexadecimal(value);
        expect(serial.hexadecimal()).toBe(SERIAL_HEXADECIMAL);
        expect(serial.decimal()).toBe(SERIAL_DECIMAL);
        expect(serial.bytes()).toBe(SERIAL_BYTES);
    });

    test('create hexadecimal empty', () => {
        const t = (): SerialNumber => {
            return SerialNumber.createFromHexadecimal('');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('is empty');
    });

    test('create hexadecimal invalid chars', () => {
        const t = (): SerialNumber => {
            return SerialNumber.createFromHexadecimal('0x001122x3');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('contains invalid characters');
    });

    test('create hexadecimal double prefix', () => {
        const t = (): SerialNumber => {
            return SerialNumber.createFromHexadecimal('0x0xFF');
        };

        expect(t).toThrow(Error);
        expect(t).toThrow('contains invalid characters');
    });

    test('create from decimal', () => {
        const serial = SerialNumber.createFromDecimal(SERIAL_DECIMAL);
        expect(serial.bytes()).toBe(SERIAL_BYTES);
    });

    test('create from bytes', () => {
        const serial = SerialNumber.createFromBytes(SERIAL_BYTES);
        expect(serial.hexadecimal()).toBe(SERIAL_HEXADECIMAL);
    });
});
