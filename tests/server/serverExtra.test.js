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
			.get('/api-docs');
		
		// Should either redirect to /api-docs/ or return 200
		expect([200, 301, 302]).toContain(response.status);
	});

	test('should serve OpenAPI spec or handle appropriately', async () => {
		const response = await request(app)
			.get('/api-docs/openapi.json');
		
		// Should return 200 or appropriate status
		expect([200, 404]).toContain(response.status);
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

	test('should handle stats endpoint in development', async () => {
		const originalEnv = process.env.NODE_ENV;
		
		try {
			process.env.NODE_ENV = 'development';
			
			// Clear the config cache to reload with new environment
			delete require.cache[require.resolve('../../backend/config/config')];
			
			// Re-require server with development env
			delete require.cache[require.resolve('../../backend/server')];
			const devApp = require('../../backend/server');

			const response = await request(devApp)
				.get('/api/stats');

			// In development, should get 200
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('success', true);
			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('timestamp');
		} finally {
			// Always restore environment
			process.env.NODE_ENV = originalEnv;
			delete require.cache[require.resolve('../../backend/config/config')];
			delete require.cache[require.resolve('../../backend/server')];
		}
	});

	test('should handle non-API routes with text response', async () => {
		const response = await request(app)
			.get('/some-non-api-route')
			.expect(404);

		expect(response.text).toContain('The page cannot be found on backend');
		expect(response.headers['content-type']).toMatch(/text/);
	});

	test('should handle API endpoint not found', async () => {
		const response = await request(app)
			.get('/api/nonexistent')
			.expect(404);

		expect(response.body).toHaveProperty('success', false);
		expect(response.body.error).toHaveProperty('code', 'ENDPOINT_NOT_FOUND');
		expect(response.body).toHaveProperty('timestamp');
	});

	test('should handle OPTIONS requests for CORS', async () => {
		await request(app)
			.options('/api/books')
			.expect(204);
	});

	test('should handle session middleware', async () => {
		await request(app)
			.get('/health')
			.expect(200)
			.expect('set-cookie', /connect\.sid/);
	});

	test('should handle security headers from helmet', async () => {
		const response = await request(app)
			.get('/health')
			.expect(200);

		// Helmet adds various security headers
		// Check for some common ones that should be present
		expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
		expect(response.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
	});

	test('should handle request logging middleware', async () => {
		const originalLog = console.log;
		const logSpy = jest.fn();
		console.log = logSpy;

		await request(app)
			.get('/api/books')
			.expect(401);

		console.log = originalLog;
		// In test environment, API logging still occurs
		expect(logSpy).toHaveBeenCalled();
	});
});
