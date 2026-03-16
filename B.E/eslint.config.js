const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', '*.js']
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'warn',
            'no-empty': 'warn',
            'prefer-const': 'error',
            'no-var': 'error'
        }
    }
);
