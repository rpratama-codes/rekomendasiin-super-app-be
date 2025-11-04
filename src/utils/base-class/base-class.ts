import { PrismaClient } from '@prisma/client';
import type { Response } from 'express';
import type { Logger } from 'winston';
import {
	type HttpExceptionCode,
	httpExceptions,
} from '../misc/http-exceptions.js';
import { ErrorConstructor } from './error.js';

export interface BaseClassParams {
	logger: Logger;
}

export interface ControllerBaseParams extends BaseClassParams {}

export interface ServiceBaseParams extends BaseClassParams {}

export class BaseClass {
	protected logger: Logger;

	constructor({ logger }: BaseClassParams) {
		this.logger = logger;
	}

	public errorSignal(code: HttpExceptionCode, message?: string) {
		const errorMessage = httpExceptions.find(
			(exception) => exception.code === code,
		);

		if (!errorMessage) {
			return new ErrorConstructor({
				code: 500,
				message: 'Internal Server Error',
			});
		}

		return new ErrorConstructor({
			code: errorMessage.code,
			message: message ?? errorMessage.message,
		});
	}
}

export class ControllerBase extends BaseClass {
	constructor({ logger }: ControllerBaseParams) {
		super({ logger });
	}

	protected sendApiResponse(
		response: Response,
		payload: {
			status: number;
			message: string;
			data?: Record<string, unknown> | Record<string, unknown>[];
		},
	) {
		return response.status(payload.status).json(payload);
	}

	protected async sendErrorResponse(
		response: Response,
		payload: {
			status: HttpExceptionCode;
			message: string;
		},
	) {
		return response.status(payload.status).json(payload);
	}
}

export class ServiceBase extends BaseClass {
	protected prisma: PrismaClient;

	constructor({ logger }: BaseClassParams) {
		super({ logger });
		this.prisma = new PrismaClient();
	}
}
