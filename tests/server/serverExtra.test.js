/**
 * Server Extra Tests
 * Additional tests to increase server.js coverage
 */

const request = require('supertest');

describe('Server Extra Coverage Tests', () => {
	let app;

	beforeAll(() => {
		// Set test environment
		process.env.NODE_ENV = 'test';
		process.env.PORT = '3334';
		process.env.JWT_SECRET = 'test_secret_key';
		process.env.SESSION_SECRET = 'test_session_secret';

		// Import app after setting environment
		app = require('../../backend/server');
	});

	test('should handle middleware chain correctly', async () => {
		const response = await request(app)
			.get('/api/books')
			.expect(401); // Unauthorized without token

		expect(response.body).toHaveProperty('message');
	});

	test('should handle API documentation routes', async () => {
		const response = await request(app)
			.get('/api-docs')
			.expect(301); // Redirect to /api-docs/
	});

	test('should serve OpenAPI spec JSON', async () => {
		await request(app)
			.get('/api-docs/openapi.json')
			.expect(200);
	});

	test('should handle different content types', async () => {
		await request(app)
			.post('/api/auth/register')
			.set('Content-Type', 'application/json')
			.send({ test: 'data' })
			.expect(400); // Validation error
	});

	test('should handle large request bodies', async () => {
		const largeBody = {
			title: 'A'.repeat(10000),
			author: 'B'.repeat(10000),
			description: 'C'.repeat(50000)
		};

		await request(app)
			.post('/api/books')
			.send(largeBody)
			.expect(401); // Unauthorized but body processed
	});

	test('should handle requests with special headers', async () => {
		await request(app)
			.get('/health')
			.set('X-Requested-With', 'XMLHttpRequest')
			.set('Accept', 'application/json')
			.expect(200);
	});

	test('should handle concurrent POST requests', async () => {
		const requests = [];
		for (let i = 0; i < 3; i++) {
			requests.push(
				request(app)
					.post('/api/auth/login')
					.send({ email: 'test@test.com', password: '123456' })
			);
		}

		const responses = await Promise.all(requests);
		responses.forEach(response => {
			expect([400, 500]).toContain(response.status);
		});
	});

	test('should handle different API endpoints', async () => {
		const endpoints = [
			'/api/books',
			'/api/books/1',
			'/api/auth/login',
			'/api/auth/register'
		];

		for (const endpoint of endpoints) {
			await request(app)
				.get(endpoint)
				.expect(response => {
					expect([401, 404, 405]).toContain(response.status);
				});
		}
	});

	test('should handle requests with query parameters', async () => {
		await request(app)
			.get('/api/books')
			.query({ page: 1, limit: 10, search: 'test' })
			.expect(401); // Unauthorized but query processed
	});

	test('should handle error conditions gracefully', async () => {
		await request(app)
			.post('/api/books')
			.send({ malformed: 'data', invalid: true })
			.expect(401); // Unauthorized
	});
});
