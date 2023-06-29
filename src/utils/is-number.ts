export const isNumber = (n: unknown) =>
    (typeof n === 'number' || n instanceof Number || (typeof n === 'string' && !Number.isNaN(n))) && Number.isFinite(n);
