export const isNumber = (n: unknown): boolean =>
  (typeof n === 'number' || (typeof n === 'string' && !Number.isNaN(n)))
  && Number.isFinite(n);

export const isScalar = (value: unknown): value is string | boolean | number =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

export const isHexadecimal = (value: string): boolean => /^[\da-f]+$/i.test(value);
