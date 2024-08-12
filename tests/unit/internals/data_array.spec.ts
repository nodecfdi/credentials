import { DateTime } from 'luxon';
import DataArraySpecimen from './data_array_specimen.js';

describe('data array', () => {
  let specimen: DataArraySpecimen;

  beforeEach(() => {
    specimen = new DataArraySpecimen({
      string: 'bar',
      int: 1,
      date: 1_547_388_916,
      array: { foo: 'bar', bar: 'foo', num: 1 },
    });
  });

  test('extract string', () => {
    expect(specimen.extractString('string')).toBe('bar');
    expect(specimen.extractString('int')).toBe('1');
    expect(specimen.extractString('date')).toBe('1547388916');
    expect(specimen.extractString('nothing')).toBe('');
    expect(specimen.extractString('array')).toBe('');
  });

  test('extract integer', () => {
    expect(specimen.extractInteger('string')).toBe(0);
    expect(specimen.extractInteger('int')).toBe(1);
    expect(specimen.extractInteger('date')).toBe(1_547_388_916);
    expect(specimen.extractInteger('nothing')).toBe(0);
    expect(specimen.extractInteger('array')).toBe(0);
  });

  test('extract date', () => {
    const zero = DateTime.fromMillis(0);
    expect(specimen.extractDateTime('date')).toStrictEqual(
      DateTime.fromISO('2019-01-13T14:15:16Z'),
    );
    expect(specimen.extractDateTime('string')).toStrictEqual(zero);
    expect(specimen.extractDateTime('int')).toStrictEqual(zero.set({ second: 1 }));
    expect(specimen.extractDateTime('nothing')).toStrictEqual(zero);
    expect(specimen.extractDateTime('array')).toStrictEqual(zero);
  });

  test('extract array', () => {
    expect(specimen.extractArray('array')).toStrictEqual({
      foo: 'bar',
      bar: 'foo',
      num: 1,
    });
    expect(specimen.extractArray('date')).toStrictEqual({});
    expect(specimen.extractArray('nothing')).toStrictEqual({});
  });

  test('extract array has string', () => {
    expect(specimen.extractArrayStrings('array')).toStrictEqual({
      foo: 'bar',
      bar: 'foo',
      num: '1',
    });
    expect(specimen.extractArrayStrings('date')).toStrictEqual({});
    expect(specimen.extractArrayStrings('nothing')).toStrictEqual({});
  });

  test('extract array omit not scalar or array values', () => {
    specimen = new DataArraySpecimen({
      array: { foo: 'bar', bar: 'foo', num: 1, empty: undefined },
    });
    expect(specimen.extractArrayStrings('array')).toStrictEqual({
      foo: 'bar',
      bar: 'foo',
      num: '1',
    });
    expect(specimen.extractArrayStrings('date')).toStrictEqual({});
    expect(specimen.extractArrayStrings('nothing')).toStrictEqual({});
  });
});
