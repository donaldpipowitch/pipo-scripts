module.exports = {
  testMatch: ['**/*.+(ts|tsx|js|jsx)'],
  // roots: ['<rootDir>/../src', '<rootDir>/../tests'],
  testPathIgnorePatterns: ['<rootDir>/jest.config.js'],
  transform: {
    '^.+\\.jsx?$': require.resolve('./jest-transformer'),
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.json'
    }
  }
};
