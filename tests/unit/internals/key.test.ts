import { KeySpecimen } from './key-specimen';
import { KeyType } from 'src/internal/key-type-enum';

describe('Key', () => {
    test('accessors_using_fake_key_data', () => {
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

    test('using_empty_array', () => {
        const key = new KeySpecimen({});
        expect(key.numberOfBits()).toBe(0);
        expect(key.publicKeyContents()).toBe('');
        expect(key.type.isRSA()).toBeTruthy();
        expect(key.isType(KeyType.RSA)).toBeTruthy();
        expect(key.typeData()).toStrictEqual({});
    });

    test('using_invalid_type', () => {
        const key = new KeySpecimen({ type: -1 });
        expect(() => key.type).toThrow('Index Not Found');
    });
});
