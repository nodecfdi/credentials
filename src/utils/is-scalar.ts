export const isScalar = (value: unknown): value is string | boolean | number =>
  /boolean|number|string/.test(typeof value);
