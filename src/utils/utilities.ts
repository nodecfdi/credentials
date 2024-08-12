export const isNumber = (n: unknown): boolean =>
  (typeof n === 'number' || n instanceof Number || (typeof n === 'string' && !Number.isNaN(n))) &&
  Number.isFinite(n);

export const isScalar = (value: unknown): value is string | boolean | number =>
  /boolean|number|string/.test(typeof value);
