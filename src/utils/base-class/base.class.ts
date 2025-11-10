import type { Logger } from 'winston';
import { logger } from '../logger/winston.js';
import {
	type HttpExceptionStatusCode,
	httpExceptions,
} from '../misc/http-exceptions.js';
import { ErrorConstructor } from './error.class.js';

// export interface BaseClassParams {}

export class BaseClass {
	protected logger: Logger;

	constructor() {
		this.logger = logger;
	}

	protected generateHttpMessage(code: number) {
		const message = httpExceptions.find((exception) => exception.code === code);

		if (!message) {
			return new ErrorConstructor({
				code: 500,
				message: 'Internal Server Error',
			});
		}

		return message;
	}

	protected errorSignal(code: HttpExceptionStatusCode, message?: string) {
		const errorMessage = this.generateHttpMessage(code);

		return new ErrorConstructor({
			code: errorMessage.code as HttpExceptionStatusCode,
			message: message ?? errorMessage.message,
		});
	}
}
