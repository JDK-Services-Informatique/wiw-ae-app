/**
 * Jest configuration for ESM project.
 * Uses babel-jest to transform JS files via Babel preset-env.
 */
module.exports = {
  // Node test environment
  testEnvironment: 'node',

  // Match test files inside the `tests` folder
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],

  // Recognize these extensions
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json'],

  // Use babel-jest to transform source files via our Babel config
  transform: {
    '^.+\\.[tj]s$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },

  // Ignore transforming node_modules by default but allow specific packages
  transformIgnorePatterns: ['/node_modules/'],

  // Increase default timeout for slower CI or local machines
  testTimeout: 10000,

  // Show individual test results
  verbose: true,

  // Provide a simple moduleNameMapper for possible static assets (no-op)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
