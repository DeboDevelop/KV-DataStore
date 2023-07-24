module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    env: {
      node: true
    },
    rules: {
      // Additional rules or overrides can be added here
    }
  };
  