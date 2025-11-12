import { rateLimit } from 'express-rate-limit';
import { ErrorConstructor } from '../utils/base-class/error.class.js';

const rateLimitHandler = () => {
	throw new ErrorConstructor({
		code: 429,
		message: 'Too many requests, please try again later.',
	});
};

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 2,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
	handler: rateLimitHandler,
});
