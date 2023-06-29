export const isScalar = (value: unknown): value is string | boolean | number => {
    return /boolean|number|string/.test(typeof value);
};
