import { Key } from '~/internal/key';
import { KeyType } from '~/internal/key-type-enum';

describe('Key', () => {
    test('accessors using fake key data', () => {
        const data = {
            bits: 512,
            key: 'x-key',
            type: KeyType.RSA,
            RSA: {
                x: 'foo'
            }
        };
        const key = new Key(data);
        expect(key.parsed()).toStrictEqual(data);
        expect(key.numberOfBits()).toBe(512);
        expect(key.publicKeyContents()).toBe('x-key');
        expect(key.type.isRSA()).toBeTruthy();
        expect(key.isType(KeyType.RSA)).toBeTruthy();
        expect(key.typeData()).toStrictEqual({ x: 'foo' });
    });

    test('using empty array', () => {
        const key = new Key({});
        expect(key.numberOfBits()).toBe(0);
        expect(key.publicKeyContents()).toBe('');
        expect(key.type.isRSA()).toBeTruthy();
        expect(key.isType(KeyType.RSA)).toBeTruthy();
        expect(key.typeData()).toStrictEqual({});
    });

    test('using invalid type', () => {
        const key = new Key({ type: -1 });
        expect(() => key.type).toThrow('Index Not Found');
    });
});
