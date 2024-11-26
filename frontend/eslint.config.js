import globals from 'globals';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react: pluginReact,
            reactHooks: pluginReactHooks,
            jsdoc,
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            ...typescriptEslintPlugin.configs.recommended.rules,
            'max-len': [
                'error',
                {
                    code: 250,
                    tabWidth: 4,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                },
            ],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            'quote-props': 'off',
            complexity: ['error', 30],
            'consistent-return': 'error',
            'default-case': 'error',
            'dot-notation': 'error',
            eqeqeq: 'error',
            'func-style': ['error', 'expression'],
            'no-alert': 'error',
            'no-div-regex': 'error',
            'no-else-return': 'error',
            'no-labels': 'error',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-floating-decimal': 'error',
            'no-implied-eval': 'error',
            'no-iterator': 'error',
            'no-lone-blocks': 'error',
            'no-loop-func': 'error',
            'no-new': 'error',
            'no-new-func': 'error',
            'no-proto': 'error',
            'no-return-assign': 'error',
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-unused-expressions': 'error',
            'no-undef-init': 'error',
            'no-undefined': 'error',
            'no-unused-vars': 'warn',
            indent: ['error', 'tab', { SwitchCase: 1 }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'space-before-blocks': ['error', 'always'],
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': ['error', { int32Hint: false }],
            'space-unary-ops': ['error', { words: true, nonwords: false }],
            'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
            semi: ['error', 'always'],
            'no-trailing-spaces': ['error'],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'block-like' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: 'block-like', next: 'block-like' },
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'any', prev: '*', next: '*' },
            ],
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 1 }],
        },
        settings: {
            react: { version: '18.2' },
        },
        ignores: ['dist', '.eslintrc.cjs'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 13,
            sourceType: 'module',
            globals: globals.node,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...jsdoc.configs.recommended.rules,
        },
    },
];
