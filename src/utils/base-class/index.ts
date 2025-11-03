import { PrismaClient } from '@prisma/client';
import type { Response } from 'express';
import type { Logger } from 'winston';

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
			data: Record<string, unknown> | Record<string, unknown>[];
		},
	) {
		return response.status(payload.status).json(payload);
	}

	protected async sendErrorResponse(
		response: Response,
		payload: {
			status: 400 | 401 | 402 | 403 | 404 | 429 | 500;
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
