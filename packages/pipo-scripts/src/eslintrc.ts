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
  plugins: ['import'],
  rules: {
    'import/no-extraneous-dependencies': ['error'],
    'spaced-comment': ['error', 'always']
  }
});
