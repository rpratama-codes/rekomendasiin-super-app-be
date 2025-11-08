import { writeFileSync } from 'node:fs';
import { URL } from 'node:url';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';
import { PrismaClient } from './generated/client.js';

export class PrismaService extends PrismaClient {
	constructor() {
		if (!process.env.DATABASE_URL) {
			throw new Error('Please set "DATABASE_URL" !');
		}

		let connectionString = process.env.DATABASE_URL;

		if (process.env.DATABASE_SSL) {
			writeFileSync('ca.pem', process.env.DATABASE_SSL);

			const dbUrl = new URL(process.env.DATABASE_URL);
			dbUrl.searchParams.append('sslrootcert', 'ca.pem');
			connectionString = dbUrl.toString();
		}

		const config = { connectionString } satisfies PoolConfig;
		const adapter = new PrismaPg(config);
		super({ adapter });
	}
}
