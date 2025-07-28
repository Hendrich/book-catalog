/**
 * DB Module Load Test
 * Specific test to cover db.js module loading and initialization
 */

describe('DB Module Load Coverage', () => {
	beforeEach(() => {
		// Clear all modules from cache
		Object.keys(require.cache).forEach(key => {
			if (key.includes('backend/db.js') || key.includes('backend\\db.js')) {
				delete require.cache[key];
			}
		});

		// Clear module registry
		jest.resetModules();
	});

	test('should load db module and initialize Pool', () => {
		// Mock pg Pool constructor
		const mockQuery = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
		const mockPool = { query: mockQuery };

		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation((config) => {
				// This should cover line 19 (Pool instantiation)
				expect(config).toBeDefined();
				expect(config.connectionString).toBeDefined();
				expect(config.ssl).toBeDefined();
				return mockPool;
			})
		}));

		// This should cover lines 17-25 when requiring the module
		const db = require('../../backend/db');

		// Verify the module exports
		expect(db).toBeDefined();
		expect(db.query).toBeDefined();
		expect(typeof db.query).toBe('function');
	});

	test('should export query function that calls pool.query', async () => {
		// Mock pg module
		const mockPoolQuery = jest.fn().mockResolvedValue({
			rows: [{ id: 1, name: 'test' }],
			rowCount: 1
		});

		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation(() => ({
				query: mockPoolQuery
			}))
		}));

		// Require fresh instance
		const db = require('../../backend/db');

		// Test the exported query function (should cover line 24-25)
		const testQuery = 'SELECT * FROM test_table';
		const testParams = ['param1', 'param2'];

		const result = await db.query(testQuery, testParams);

		// Verify that pool.query was called with correct parameters
		expect(mockPoolQuery).toHaveBeenCalledWith(testQuery, testParams);
		expect(result).toEqual({
			rows: [{ id: 1, name: 'test' }],
			rowCount: 1
		});
	});

	test('should handle dotenv config loading', () => {
		// Mock dotenv to ensure it's called during module load
		jest.doMock('dotenv', () => ({
			config: jest.fn()
		}));

		const mockPool = {
			query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 })
		};

		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation(() => mockPool)
		}));

		// This should trigger dotenv.config() call on line 18
		const db = require('../../backend/db');

		expect(db).toBeDefined();

		// Clean up
		jest.unmock('dotenv');
	});

	test('should create Pool with SSL configuration', () => {
		let capturedConfig;

		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation((config) => {
				capturedConfig = config;
				return {
					query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 })
				};
			})
		}));

		// Load module to trigger Pool creation
		require('../../backend/db');

		// Verify SSL configuration was set correctly
		expect(capturedConfig.ssl).toEqual({ rejectUnauthorized: false });
	});

	afterEach(() => {
		jest.resetModules();
		jest.restoreAllMocks();
	});
});
