import { SerialNumber } from 'src/serial-number';

describe('SerialNumber', () => {
    const SerialHexadecimal = '3330303031303030303030333030303233373038';
    const SerialBytes = '30001000000300023708';
    const SerialDecimal = '292233162870206001759766198425879490508935868472';

    test.each([[''], ['0X'], ['0x']])('create_from_hexadecimal_%s', (prefix) => {
        const value = `${prefix}${SerialHexadecimal}`;
        const serial = SerialNumber.createFromHexadecimal(value);
        expect(serial.hexadecimal()).toBe(SerialHexadecimal);
        expect(serial.decimal()).toBe(SerialDecimal);
        expect(serial.bytes()).toBe(SerialBytes);
    });

    test('create_hexadecimal_empty', () => {
        const t = (): SerialNumber => SerialNumber.createFromHexadecimal('');

        expect(t).toThrow(Error);
        expect(t).toThrow('is empty');
    });

    test('create_hexadecimal_invalid_chars', () => {
        const t = (): SerialNumber => SerialNumber.createFromHexadecimal('0x001122x3');

        expect(t).toThrow(Error);
        expect(t).toThrow('contains invalid characters');
    });

    test('create_hexadecimal_double_prefix', () => {
        const t = (): SerialNumber => SerialNumber.createFromHexadecimal('0x0xFF');

        expect(t).toThrow(Error);
        expect(t).toThrow('contains invalid characters');
    });

    test('create_from_decimal', () => {
        const serial = SerialNumber.createFromDecimal(SerialDecimal);
        expect(serial.bytes()).toBe(SerialBytes);
    });

    test('create_from_bytes', () => {
        const serial = SerialNumber.createFromBytes(SerialBytes);
        expect(serial.hexadecimal()).toBe(SerialHexadecimal);
    });
});
