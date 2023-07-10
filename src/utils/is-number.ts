export const isNumber = (n: unknown): boolean =>
    (typeof n === 'number' ||
        n instanceof Number ||
        (typeof n === 'string' && !Number.isNaN(n))) &&
    Number.isFinite(n);
