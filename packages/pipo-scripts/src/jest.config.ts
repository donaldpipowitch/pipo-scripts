module.exports = {
  testMatch: ['**/*.js'],
  // roots: ['<rootDir>/../src', '<rootDir>/../tests'],
  testPathIgnorePatterns: ['<rootDir>/jest.config.js'],
  transform: { '^.+\\.jsx?$': require.resolve('./jest-transformer') }
};
