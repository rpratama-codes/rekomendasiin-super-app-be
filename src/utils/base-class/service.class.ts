import { PrismaService } from '../../services/prisma/prisma.service.js';
import { BaseClass, type BaseClassParams } from './base.class.js';

export interface ServiceBaseParams extends BaseClassParams {}

export class ServiceBase extends BaseClass {
	protected prisma: PrismaService;

	constructor({ logger }: ServiceBaseParams) {
		super({ logger });
		this.prisma = new PrismaService();
	}
}
