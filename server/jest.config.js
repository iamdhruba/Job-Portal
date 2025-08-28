export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  verbose: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};