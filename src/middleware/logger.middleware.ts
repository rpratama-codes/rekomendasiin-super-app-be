import morgan from 'morgan';
import { logger } from '../utils/logger/winston.js';

export const loggerMiddleware = morgan('combined', {
	stream: {
		write: (message: string) => {
			logger.info(message);
		},
	},
});
