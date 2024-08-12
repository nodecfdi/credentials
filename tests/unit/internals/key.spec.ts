import { KeyType } from '#src/index';
import KeySpecimen from './key_specimen.js';

describe('key', () => {
  test('accessors using fake key data', () => {
    const data = {
      bits: 512,
      key: 'x-key',
      type: KeyType.RSA,
      RSA: {
        x: 'foo',
      },
    };
    const key = new KeySpecimen(data);
    expect(key.parsed()).toStrictEqual(data);
    expect(key.numberOfBits()).toBe(512);
    expect(key.publicKeyContents()).toBe('x-key');
    expect(key.type.isRSA()).toBeTruthy();
    expect(key.isType(KeyType.RSA)).toBeTruthy();
    expect(key.typeData()).toStrictEqual({ x: 'foo' });
  });

  test('using empty array', () => {
    const key = new KeySpecimen({});
    expect(key.numberOfBits()).toBe(0);
    expect(key.publicKeyContents()).toBe('');
    expect(key.type.isRSA()).toBeTruthy();
    expect(key.isType(KeyType.RSA)).toBeTruthy();
    expect(key.typeData()).toStrictEqual({});
  });

  test('using invalid type', () => {
    const key = new KeySpecimen({ type: -1 });
    expect(() => key.type).toThrow('Index Not Found');
  });
});
