module.exports = {
  rootDir: '../../',
  displayName: 'smartconfig-backend',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testTimeout: 30000,
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  maxWorkers: 1,            // fuerza ejecución secuencial
  // runInBand alternativa si se lanza desde CLI
};
