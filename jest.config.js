module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
