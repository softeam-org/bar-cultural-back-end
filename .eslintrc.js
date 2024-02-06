module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'eslint-plugin-import-helpers',
  ],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-else-return': ['error'],
    'lines-between-class-members': ['error', 'always'],
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          '/^@nest/',
          'module',
          '/^@src/',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
  },
};
