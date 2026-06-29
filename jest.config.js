module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@libs/logger$': '<rootDir>/libs/logger/src',
    '^@libs/logger/(.*)$': '<rootDir>/libs/logger/src/$1',
    '^@libs/shared$': '<rootDir>/libs/shared/src',
    '^@libs/shared/(.*)$': '<rootDir>/libs/shared/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(marked)/)'],
};
