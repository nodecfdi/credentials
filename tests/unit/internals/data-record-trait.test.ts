import { DataRecordTraitSpecimen } from './data-record-trait-specimen';
import { DateTime } from 'luxon';

describe('DataRecordTrait', () => {
    let specimen: DataRecordTraitSpecimen;

    beforeEach(() => {
        specimen = new DataRecordTraitSpecimen({
            string: 'bar',
            int: 1,
            date: 1547388916,
            object: { foo: 'bar', bar: 'foo', num: 1 },
        });
    });

    test('extract string', () => {
        expect(specimen.extractString('string')).toBe('bar');
        expect(specimen.extractString('int')).toBe('1');
        expect(specimen.extractString('date')).toBe('1547388916');
        expect(specimen.extractString('nothing')).toBe('');
        expect(specimen.extractString('object')).toBe('');
    });

    test('extract integer', () => {
        expect(specimen.extractInteger('string')).toBe(0);
        expect(specimen.extractInteger('int')).toBe(1);
        expect(specimen.extractInteger('date')).toBe(1547388916);
        expect(specimen.extractInteger('nothing')).toBe(0);
        expect(specimen.extractInteger('object')).toBe(0);
    });

    test('extract date', () => {
        const zero = DateTime.fromMillis(0);
        expect(specimen.extractDateTime('string')).toStrictEqual(zero);
        expect(specimen.extractDateTime('int')).toStrictEqual(zero.set({ second: 1 }));
        expect(specimen.extractDateTime('date')).toStrictEqual(DateTime.fromISO('2019-01-13T14:15:16Z'));
        expect(specimen.extractDateTime('nothing')).toStrictEqual(zero);
        expect(specimen.extractDateTime('object')).toStrictEqual(zero);
    });

    test('extract object', () => {
        expect(specimen.extractObject('object')).toStrictEqual({
            foo: 'bar',
            bar: 'foo',
            num: 1,
        });
        expect(specimen.extractObject('date')).toStrictEqual({});
        expect(specimen.extractObject('nothing')).toStrictEqual({});
    });

    test('extract object has string', () => {
        expect(specimen.extractObjectString('object')).toStrictEqual({
            foo: 'bar',
            bar: 'foo',
            num: '1',
        });
        expect(specimen.extractObjectString('date')).toStrictEqual({});
        expect(specimen.extractObjectString('nothing')).toStrictEqual({});
    });
});
