import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from 'express';
import { ZodError } from 'zod';
import { ErrorConstructor } from '../utils/base-class/error.class.js';
import { logger } from '../utils/logger/winston.js';
import { ErrorAuthMiddleware } from './auth.middleware.js';

export const errorHandlerMiddleware: ErrorRequestHandler = (
	err: ErrorConstructor | Error | PrismaClientKnownRequestError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error('-', err);

	if (err instanceof ErrorAuthMiddleware) {
		return res.status(401).json({
			code: 401,
			message: err.message,
		});
	}

	if (err instanceof SyntaxError) {
		return res.status(400).json({
			code: 400,
			message: err.message,
		});
	}

	if (err instanceof ErrorConstructor) {
		return res.status(err.code).json({
			code: err.code,
			message: err.message,
		});
	}

	if (err instanceof PrismaClientKnownRequestError) {
		/**
		 * TODO : Change this later!
		 */
		return res.status(500).json({
			code: 500,
			message: 'Internal Server Error',
		});
	}

	if (err instanceof ZodError) {
		return res.status(422).json({
			code: 422,
			message: 'Unprocessable Content',
			data: JSON.parse(err.message),
		});
	}

	return res.status(500).json({
		code: 500,
		message: 'Internal Server Error',
	});
};
