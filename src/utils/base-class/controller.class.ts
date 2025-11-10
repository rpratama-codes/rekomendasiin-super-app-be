import type { Response } from 'express';
import type {
	HttpExceptionStatusCode,
	HttpSuccessfulStatusCode,
} from '../misc/http-exceptions.js';
import { BaseClass } from './base.class.js';

export type ResponseData = Record<string, unknown> | Record<string, unknown>[];

export class ControllerBase extends BaseClass {
	private generateMessage(
		code: HttpSuccessfulStatusCode | HttpExceptionStatusCode,
		message?: string,
	) {
		const generated = this.generateHttpMessage(code);

		return {
			code: generated.code,
			message: message ?? generated.message,
		};
	}

	protected sendApiResponse(
		response: Response,
		payload: {
			status: HttpSuccessfulStatusCode;
			message?: string;
			data?: ResponseData;
		},
	) {
		const defaultMessage = this.generateMessage(payload.status);

		return response
			.status(payload.status)
			.json({ ...defaultMessage, data: payload.data });
	}

	protected async sendErrorResponse(
		response: Response,
		payload: {
			status: HttpExceptionStatusCode;
			message?: string;
			data?: ResponseData;
		},
	) {
		const defaultMessage = this.generateMessage(payload.status);

		return response.status(payload.status).json(defaultMessage);
	}
}
