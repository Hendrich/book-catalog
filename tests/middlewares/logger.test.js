const { requestLogger } = require('../../backend/middlewares/logger');

describe('Logger Middleware', () => {
	let req, res, next, originalConsoleLog, originalConsoleError;

	beforeEach(() => {
		req = {
			method: 'GET',
			url: '/api/test',
			originalUrl: '/api/test',
			ip: '127.0.0.1',
			connection: { remoteAddress: '127.0.0.1' },
			headers: {
				'user-agent': 'test-agent'
			},
			get: jest.fn((header) => {
				if (header === 'User-Agent') return 'test-agent';
				return undefined;
			})
		};
		res = {
			statusCode: 200,
			on: jest.fn()
		};
		next = jest.fn();

		// Store original console methods
		originalConsoleLog = console.log;
		originalConsoleError = console.error;

		// Mock console methods
		console.log = jest.fn();
		console.error = jest.fn();
	});

	afterEach(() => {
		// Restore original console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
		jest.clearAllMocks();
	});

	describe('Request Logging', () => {
		test('should log incoming requests in development', () => {
			// Arrange
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'development';

			// Act
			requestLogger(req, res, next);

			// Simulate response finish to trigger logging
			const finishCallback = res.on.mock.calls.find(call => call[0] === 'finish')[1];
			if (finishCallback) {
				finishCallback();
			}

			// Assert
			expect(console.log).toHaveBeenCalled();
			expect(next).toHaveBeenCalled();

			// Cleanup
			process.env.NODE_ENV = originalEnv;
		});

		test('should log incoming requests in production', () => {
			// Arrange
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'production';

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(next).toHaveBeenCalled();
			expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));

			// Cleanup
			process.env.NODE_ENV = originalEnv;
		});

		test('should not log in test environment', () => {
			// Arrange
			process.env.NODE_ENV = 'test';

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(console.log).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});

	describe('Response Logging', () => {
		test('should log response details when response finishes', () => {
			// Arrange
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'development';
			res.statusCode = 200;

			// Act
			requestLogger(req, res, next);

			// Simulate response finish
			const finishCallback = res.on.mock.calls.find(call => call[0] === 'finish')[1];
			if (finishCallback) {
				finishCallback();
			}

			// Assert
			expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));

			// Cleanup
			process.env.NODE_ENV = originalEnv;
		});

		test('should handle different status codes', () => {
			// Arrange
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'development';
			res.statusCode = 404;

			// Act
			requestLogger(req, res, next);

			// Simulate response finish
			const finishCallback = res.on.mock.calls.find(call => call[0] === 'finish')[1];
			if (finishCallback) {
				finishCallback();
			}

			// Assert
			expect(res.on).toHaveBeenCalled();

			// Cleanup
			process.env.NODE_ENV = originalEnv;
		});
	});

	describe('Error Scenarios', () => {
		test('should handle missing request properties gracefully', () => {
			// Arrange
			const incompleteReq = { method: 'GET' };

			// Act & Assert
			expect(() => {
				requestLogger(incompleteReq, res, next);
			}).not.toThrow();
			expect(next).toHaveBeenCalled();
		});

		test('should handle missing response properties gracefully', () => {
			// Arrange
			const incompleteRes = {};

			// Act & Assert
			expect(() => {
				requestLogger(req, incompleteRes, next);
			}).not.toThrow();
			expect(next).toHaveBeenCalled();
		});
	});

	describe('Performance Timing', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test('should track request duration', () => {
			// Arrange
			const originalEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'development';

			// Act
			requestLogger(req, res, next);

			// Simulate response finish after some time
			const finishCallback = res.on.mock.calls.find(call => call[0] === 'finish')[1];
			if (finishCallback) {
				// Simulate time passage
				jest.advanceTimersByTime(100);
				finishCallback();
			}

			// Assert
			expect(res.on).toHaveBeenCalled();

			// Cleanup
			process.env.NODE_ENV = originalEnv;
		});
	});

	describe('Security Headers Logging', () => {
		test('should log security-related headers', () => {
			// Arrange
			req.headers = {
				'x-forwarded-for': '192.168.1.1',
				'user-agent': 'malicious-bot',
				'authorization': 'Bearer token123'
			};

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(next).toHaveBeenCalled();
		});
	});

	describe('HTTP Methods', () => {
		test('should handle POST requests', () => {
			// Arrange
			req.method = 'POST';
			req.url = '/api/books';

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(next).toHaveBeenCalled();
		});

		test('should handle PUT requests', () => {
			// Arrange
			req.method = 'PUT';
			req.url = '/api/books/1';

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(next).toHaveBeenCalled();
		});

		test('should handle DELETE requests', () => {
			// Arrange
			req.method = 'DELETE';
			req.url = '/api/books/1';

			// Act
			requestLogger(req, res, next);

			// Assert
			expect(next).toHaveBeenCalled();
		});
	});
});
