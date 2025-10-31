import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import type { Logger } from 'winston';

export interface BaseClassParams {
	logger: Logger;
}

export interface ControllerBaseParams extends BaseClassParams {
	request: Request;
	response: Response;
}

export interface ServiceBaseParams extends BaseClassParams {}

export class BaseClass {
	protected logger: Logger;

	constructor({ logger }: BaseClassParams) {
		this.logger = logger;
	}
}

export class ControllerBase extends BaseClass {
	protected request: Request;
	protected response: Response;

	constructor({ request, response, logger }: ControllerBaseParams) {
		super({ logger });
		this.request = request;
		this.response = response;
	}
}

export class ServiceBase extends BaseClass {
	protected prisma: PrismaClient;

	constructor({ logger }: BaseClassParams) {
		super({ logger });
		this.prisma = new PrismaClient();
	}
}
