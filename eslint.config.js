import parserTypescript from '@typescript-eslint/parser'
import pluginTypescript from '@typescript-eslint/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
const config = [
    // src
    {
        files: ['src/**/*.{ts,js}'],
        languageOptions: {
            parser: parserTypescript,
            /** @type {import('@typescript-eslint/parser').ParserOptions} */
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': pluginTypescript,
        },
        rules: {
            'semi': ['warn', 'never'],
            'quotes': ['warn', 'single'],
            'no-tabs': 'warn',
            'eqeqeq': ['warn', 'always'],
            'array-bracket-spacing': ['warn', 'never'],
            'object-curly-spacing': ['warn', 'always'],
            'space-in-parens': ['warn', 'never'],
            'comma-spacing': ['warn', { 'before': false, 'after': true }],
            'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
            'no-trailing-spaces': ['warn'],
            'indent': ['warn', 4, { SwitchCase: 1 }],
            'no-var': 'warn',
            'prefer-const': ['warn', {
                destructuring: 'all',
                ignoreReadBeforeAssign: false
            }],
            'no-duplicate-imports': 'warn',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/explicit-member-accessibility': [
                'warn',
                {
                    accessibility: 'explicit',
                    overrides: {
                        constructors: 'no-public',
                    },
                },
            ],
            '@typescript-eslint/member-ordering': [
                'warn',
                {
                    default: [
                        // Static
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',
                        ['public-static-get', 'public-static-set', 'public-static-accessor'],
                        'public-static-method',
                        ['protected-static-get', 'protected-static-set', 'protected-static-accessor'],
                        'protected-static-method',
                        ['private-static-get', 'private-static-set', 'private-static-accessor'],
                        'private-static-method',
                        // Fields
                        'public-instance-field',
                        'protected-instance-field',
                        'private-instance-field',
                        // Constructor
                        'constructor',
                        // public Methods/Get/Set
                        ['public-instance-get', 'public-instance-set', 'public-instance-accessor'],
                        'public-abstract-method',
                        'public-instance-method',
                        // protected Methods/Get/Set
                        ['protected-instance-get', 'protected-instance-set', 'protected-instance-accessor'],
                        'protected-abstract-method',
                        'protected-instance-method',
                        // private Methods/Get/Set
                        ['private-instance-get', 'private-instance-set', 'private-instance-accessor'],
                        'private-instance-method',
                    ]
                }
            ],
        }
    }
]

export default config