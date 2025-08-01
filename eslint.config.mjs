// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/*.json',
      '**/*.md',
      'eslint.config.mjs',
      '!src/**/*', // Include src folder
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      unicorn,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        // Interfaces and types must be PascalCase
        {
          selector: ['typeLike'],
          format: ['PascalCase'],
        },
        // Constants in .constants.ts files must be SCREAMING_SNAKE_CASE
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          types: ['boolean', 'string', 'number', 'array'],
          format: ['UPPER_CASE'],
          filter: {
            regex: '^[A-Z0-9_]+$',
            match: true,
          },
        },
        // Allow other const variables to use any format
        {
          selector: 'variable',
          modifiers: ['const'],
          format: null,
        },
      ],

      // File naming rules (kebab-case)
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['\\.d\\.ts$', '\\.spec\\.ts$', '\\.test\\.ts$', '\\.config\\.(js|ts)$'],
        },
      ],

      // General best practices
      'no-console': 'warn',
      'consistent-return': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
  {
    // Extra strict rules for constants files
    files: ['**/*.constants.ts', '**/*.constant.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
        },
      ],
    },
  },
);
