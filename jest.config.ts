export default {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testTimeout: 30000,
    roots: ['<rootDir>/__tests__/'],
    moduleFileExtensions: ['ts', 'js'],

};