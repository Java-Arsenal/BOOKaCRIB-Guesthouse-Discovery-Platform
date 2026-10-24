module.exports = {
  testEnvironment: 'node',
  // Keep the backend regression suite scoped while transpiling its TypeScript tests through Babel.
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: { '^.+\\.tsx?$': 'babel-jest' },
};
