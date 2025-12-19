'use strict';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.APP_KEYS = 'testkey1,testkey2';
process.env.API_TOKEN_SALT = 'testsalt';
process.env.ADMIN_JWT_SECRET = 'adminjwtsecret';
process.env.TRANSFER_TOKEN_SALT = 'transfersalt';
process.env.ENCRYPTION_KEY = 'testencryptionkey';
// DATABASE_FILENAME se asigna dinámicamente en setupStrapi

// Jest timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};
