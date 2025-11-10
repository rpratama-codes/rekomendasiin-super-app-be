import { PrismaService } from '../../services/prisma/prisma.service.js';
import { BaseClass } from './base.class.js';

export class ServiceBase extends BaseClass {
	protected prisma: PrismaService;

	constructor() {
		super();
		this.prisma = new PrismaService();
	}
}
