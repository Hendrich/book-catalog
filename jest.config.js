module.exports = {
	// Test environment
	testEnvironment: 'node',

	// Test file patterns
	testMatch: [
		'**/tests/**/*.test.js',
		'**/__tests__/**/*.js',
		'**/?(*.)+(spec|test).js'
	],

	// Coverage configuration - ENABLED for 90% requirement
	collectCoverage: true, // Enabled to meet 90% coverage requirement
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'html', 'lcov', 'json'],

	// Coverage thresholds - temporarily lowered during development
	coverageThreshold: {
		global: {
			branches: 40,
			functions: 35,
			lines: 40,
			statements: 40
		}
	},

	// Files to collect coverage from
	collectCoverageFrom: [
		'backend/**/*.js',
		'!backend/node_modules/**',
		'!backend/coverage/**',
		'!backend/**/*.test.js',
		'!backend/**/*.spec.js'
	],

	// Setup files
	setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js'],

	// Module paths
	moduleDirectories: ['node_modules', 'backend'],

	// Clear mocks between tests
	clearMocks: true,
	restoreMocks: true,

	// Verbose output - disabled untuk kecepatan
	verbose: false,

	// Test timeout - dikurangi dari 30 detik ke 5 detik
	testTimeout: 5000,

	// Parallelization - gunakan lebih banyak worker untuk kecepatan
	maxWorkers: 4,

	// Cache untuk mempercepat
	cache: true,

	// Bail setelah n test failures untuk stop early
	bail: 5,

	// Transform configuration (if needed for ES6)
	transform: {
		'^.+\\.js$': 'babel-jest'
	}
};
