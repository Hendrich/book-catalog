/**
 * Error Handler Simple Coverage Tests
 */

const { AppError, errorHandler, notFound } = require('../../backend/middlewares/errorHandler');

describe('Error Handler Simple Coverage', () => {
	let mockReq, mockRes, mockNext;

	beforeEach(() => {
		mockReq = {};
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			headersSent: false
		};
		mockNext = jest.fn();
	});

	test('should create AppError with message and status', () => {
		const error = new AppError('Test error', 400);
		expect(error.message).toBe('Test error');
		expect(error.statusCode).toBe(400);
		expect(error.isOperational).toBe(true);
	});

	test('should handle notFound middleware', () => {
		mockReq.originalUrl = '/nonexistent';
		notFound(mockReq, mockRes, mockNext);
		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
	});

	test('should handle error in development mode', () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		const error = new AppError('Test error', 400);
		errorHandler(error, mockReq, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(400);
		expect(mockRes.json).toHaveBeenCalled();

		process.env.NODE_ENV = originalEnv;
	});

	test('should handle error in production mode', () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';

		const error = new AppError('Test error', 400);
		errorHandler(error, mockReq, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(400);
		expect(mockRes.json).toHaveBeenCalled();

		process.env.NODE_ENV = originalEnv;
	});

	test('should handle non-operational errors', () => {
		const error = new Error('Non-operational error');
		errorHandler(error, mockReq, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(500);
		expect(mockRes.json).toHaveBeenCalled();
	});

	test('should handle errors with headers already sent', () => {
		mockRes.headersSent = true;
		const error = new AppError('Test error', 400);

		errorHandler(error, mockReq, mockRes, mockNext);
		expect(mockNext).toHaveBeenCalledWith(error);
	});
});
