import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    },
  },
  {
    // Add a specific config for test files
    files: ['src/__testes__/**/*.js'], // Matches your test files
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest globals
      },
    },
  },
];