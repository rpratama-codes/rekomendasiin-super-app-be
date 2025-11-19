import type { HttpExceptionStatusCode } from '../misc/http-exceptions.js';

export type ErrorType = {
	code: HttpExceptionStatusCode;
	message: string;
	cause?: unknown;
};

export class KnownError extends Error {
	public code: HttpExceptionStatusCode;

	constructor({ code, message, cause }: ErrorType) {
		super(message, { cause });
		this.code = code;
	}
}
