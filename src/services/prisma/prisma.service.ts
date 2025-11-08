import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
	constructor() {
		/**
		 * Improvement :
		 * It can use to config pg ssl here!
		 */
		const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL,
		});

		super({ adapter });
	}
}
