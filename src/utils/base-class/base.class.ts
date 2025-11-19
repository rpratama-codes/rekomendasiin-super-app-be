import type { Logger } from 'winston';
import { logger } from '../logger/winston.js';
import {
	type HttpExceptionStatusCode,
	httpExceptions,
} from '../misc/http-exceptions.js';
import { KnownError } from './error.class.js';

// export interface BaseClassParams {}

export class BaseClass {
	protected logger: Logger;

	constructor() {
		this.logger = logger;
	}

	/**
	 *
	 * @param code number
	 * @returns string
	 *
	 * Don't use this method directly, use `errorSignal` instead.
	 */
	protected generateHttpMessage(code: number) {
		const message = httpExceptions.find((exception) => exception.code === code);

		if (!message) {
			return new KnownError({
				code: 500,
				message: 'No error message provided!.',
			});
		}

		return message;
	}

	/**
	 *
	 * @param code HttpExceptionStatusCode
	 * @param message string
	 * @returns KnownError
	 *
	 * Error Can Be Happen Every Where!.
	 * The boundaries is service not allow to know http, but it's not an http.
	 * It just method that return Error Instance, not a method that responsible
	 * for sending a http response, and please note that http code below is NOT
	 * something to worry about, actually we can use special application code,
	 * But for simplicity, i use http code!.
	 */
	protected errorSignal(code: HttpExceptionStatusCode, message?: string) {
		const errorMessage = this.generateHttpMessage(code);

		return new KnownError({
			code: errorMessage.code as HttpExceptionStatusCode,
			message: message ?? errorMessage.message,
		});
	}
}
