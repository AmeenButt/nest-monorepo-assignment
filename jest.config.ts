import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@app/common/(.*)$': '<rootDir>/common/src/$1',
    '^@app/core/(.*)$': '<rootDir>/core/src/$1',
    '^@app/config/(.*)$': '<rootDir>/config/src/$1',
  },
};

export default config;
