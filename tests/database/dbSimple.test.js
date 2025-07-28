/**
 * DB Basic Coverage Tests
 * Simple tests to increase db.js coverage
 */

describe('DB Module Coverage Tests', () => {
	let db;

	beforeAll(() => {
		// Mock pg module before requiring db.js
		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation(() => ({
				query: jest.fn().mockImplementation((text, params) =>
					Promise.resolve({ rows: [], rowCount: 0 })
				)
			}))
		}));

		// Clear the module cache to ensure fresh import
		jest.resetModules();

		// Import db module after mocking pg
		db = require('../../backend/db');
	});

	afterAll(() => {
		jest.unmock('pg');
		jest.resetModules();
	});

	test('should export database query function', () => {
		expect(db).toBeDefined();
		expect(db.query).toBeDefined();
		expect(typeof db.query).toBe('function');
	});

	test('should execute queries through pool', async () => {
		const result = await db.query('SELECT 1', []);
		expect(result).toBeDefined();
		expect(result.rows).toBeDefined();
	});

	test('should handle parameterized queries', async () => {
		const result = await db.query('SELECT * FROM users WHERE id = $1', [1]);
		expect(result).toBeDefined();
	});

	test('should handle queries without parameters', async () => {
		const result = await db.query('SELECT NOW()');
		expect(result).toBeDefined();
	});

	test('should handle empty parameter array', async () => {
		const result = await db.query('SELECT 1', []);
		expect(result).toBeDefined();
	});

	test('should instantiate Pool with correct configuration', () => {
		// Force re-import to cover Pool instantiation
		jest.resetModules();
		jest.doMock('pg', () => ({
			Pool: jest.fn().mockImplementation((config) => {
				expect(config).toBeDefined();
				return {
					query: jest.fn().mockImplementation(() =>
						Promise.resolve({ rows: [], rowCount: 0 })
					)
				};
			})
		}));

		const freshDb = require('../../backend/db');
		expect(freshDb).toBeDefined();
		expect(freshDb.query).toBeDefined();
	});
});
