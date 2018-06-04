export const getEslintConfig = () => ({
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true
    }
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['import', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': ['error'],
    'prettier/prettier': 'error',
    'spaced-comment': ['error', 'always']
  }
});
