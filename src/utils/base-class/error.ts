import type { HttpExceptionCode } from '../misc/http-exceptions.js';

export type ErrorType = {
	code: HttpExceptionCode;
	message: string;
	cause?: unknown;
};

export class ErrorConstructor extends Error {
	public code: HttpExceptionCode;

	constructor({ code, message, cause }: ErrorType) {
		super(message, { cause });
		this.code = code;
	}
}
