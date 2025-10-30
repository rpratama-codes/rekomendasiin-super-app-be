import morgan from 'morgan';
import { logger } from '../utils/logger/winston.ts';

export const loggerMiddleware = morgan('combined', {
	stream: {
		write: (message: string) => {
			logger.http(`incoming-request`, message);
		},
	},
});
