/**
 * @type {import('xo').Options}
 */
const xoConfig = {
    space: true,
    prettier: true,
    ignores: ['dist', 'docs', 'examples', 'coverage'],
    rules: {
        'new-cap': [
            'error',
            {
                newIsCap: true,
                capIsNew: true,
                capIsNewExceptions: ['Mixin'],
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                /// selector: ['variableLike', 'memberLike', 'property', 'method'],
                // Note: Leaving out `parameter` and `typeProperty` because of the mentioned known issues.
                // Note: We are intentionally leaving out `enumMember` as it's usually pascal-case or upper-snake-case.
                selector: [
                    'variable',
                    'function',
                    'classProperty',
                    'parameterProperty',
                    'classMethod',
                    'objectLiteralMethod',
                    'typeMethod',
                    'accessor',
                ],
                format: ['camelCase', 'PascalCase'],
                // We allow double underscore because of GraphQL type names and some React names.
                leadingUnderscore: 'allowSingleOrDouble',
                trailingUnderscore: 'allow',
                // Ignore `{'Retry-After': retryAfter}` type properties.
                filter: {
                    regex: '[- ]',
                    match: false,
                },
            },
            {
                selector: 'typeLike',
                format: ['StrictPascalCase'],
            },
            {
                selector: 'variable',
                types: ['boolean'],
                format: ['StrictPascalCase'],
                prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
            },
            {
                // Interface name should not be prefixed with `I`.
                selector: 'interface',
                filter: /^(?!I)[A-Z]/.source,
                format: ['StrictPascalCase'],
            },
            {
                // Type parameter name should either be `T` or a descriptive name.
                selector: 'typeParameter',
                filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
                format: ['StrictPascalCase'],
            },
            // Allow these in non-camel-case when quoted.
            {
                selector: ['classProperty', 'objectLiteralProperty'],
                format: null,
                modifiers: ['requiresQuotes'],
            },
        ],
    },
};

module.exports = xoConfig;
