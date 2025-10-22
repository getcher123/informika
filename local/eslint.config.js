import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', 'vendor/**', 'bitrix/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: await import('eslint-plugin-import'),
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/order': ['warn', { 'newlines-between': 'always' }],
    },
  },
  {
    rules: {}, // оставлено для переопределений при необходимости
  },
];
