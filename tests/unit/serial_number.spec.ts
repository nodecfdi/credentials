import SerialNumber from '#src/serial_number';

describe('serial number', () => {
  const serialHexadecimal = '3330303031303030303030333030303233373038';
  const serialBytes = '30001000000300023708';
  const serialDecimal = '292233162870206001759766198425879490508935868472';

  test.each([[''], ['0X'], ['0x']])('create from hexadecimal %s', (prefix) => {
    const value = `${prefix}${serialHexadecimal}`;
    const serial = SerialNumber.createFromHexadecimal(value);
    expect(serial.hexadecimal()).toBe(serialHexadecimal);
    expect(serial.decimal()).toBe(serialDecimal);
    expect(serial.bytes()).toBe(serialBytes);
  });

  test('create hexadecimal empty', () => {
    const t = (): SerialNumber => SerialNumber.createFromHexadecimal('');

    expect(t).toThrow(Error);
    expect(t).toThrow('is empty');
  });

  test('create hexadecimal invalid chars', () => {
    const t = (): SerialNumber => SerialNumber.createFromHexadecimal('0x001122x3');

    expect(t).toThrow(Error);
    expect(t).toThrow('contains invalid characters');
  });

  test('create hexadecimal double prefix', () => {
    const t = (): SerialNumber => SerialNumber.createFromHexadecimal('0x0xFF');

    expect(t).toThrow(Error);
    expect(t).toThrow('contains invalid characters');
  });

  test('create from decimal', () => {
    const serial = SerialNumber.createFromDecimal(serialDecimal);
    expect(serial.bytes()).toBe(serialBytes);
  });

  test('create from bytes', () => {
    const serial = SerialNumber.createFromBytes(serialBytes);
    expect(serial.hexadecimal()).toBe(serialHexadecimal);
  });
});
