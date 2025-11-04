import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from 'express';
import { ErrorConstructor } from '../utils/base-class/error.js';
import { logger } from '../utils/logger/winston.js';

export const errorHandlerMiddleware: ErrorRequestHandler = (
	err: ErrorConstructor | Error | PrismaClientKnownRequestError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error('Error Handler :', err);

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

	return res.status(500).json({
		code: 500,
		message: 'Internal Server Error',
	});
};
