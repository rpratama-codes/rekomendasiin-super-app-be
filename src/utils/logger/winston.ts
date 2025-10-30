import winston from 'winston';

/**
 * Here is to setup logger
 * visit :
 * https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
 */

export const logger = winston.createLogger({
	format: winston.format.json(),
	transports: [new winston.transports.Console()],
});
