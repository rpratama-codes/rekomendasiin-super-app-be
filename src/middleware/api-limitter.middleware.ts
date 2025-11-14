import { rateLimit } from 'express-rate-limit';
import { ErrorConstructor } from '../utils/base-class/error.class.js';

const rateLimitHandler = () => {
	throw new ErrorConstructor({
		code: 429,
		message: 'Too many requests, please try again later.',
	});
};

export const apiLimiterMiddleware = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 20,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
	handler: rateLimitHandler,
});
