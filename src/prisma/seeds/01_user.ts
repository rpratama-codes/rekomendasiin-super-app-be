import { PrismaClient, type User } from '@prisma/client';
import argon2 from 'argon2';

async function main(): Promise<void> {
	try {
		const prisma = new PrismaClient();

		const users: User[] = [
			{
				id: '019a3855-1ec1-7206-90a2-7a0d163d91d5',
				first_name: 'admin',
				last_name: 'admin',
				email: 'admin@localhost',
				username: `admin`,
				password: 'admin',
				role: 'system_user',
				picture: null,
			},
			{
				id: '019a385b-af6a-7f3b-9807-1e624354124f',
				first_name: 'user',
				last_name: 'user',
				email: 'user@localhost',
				username: `user`,
				password: 'user',
				role: 'user',
				picture: null,
			},
		];

		await prisma.$transaction(async (tx) => {
			for (const user of users) {
				let password = null;

				if (user.password) {
					password = await argon2.hash(user.password as string);
				}

				await tx.user.upsert({
					create: { ...user, password },
					update: { ...user, password },
					where: {
						id: user.id,
					},
				});
			}
		});

		await prisma.$disconnect();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error);
		}
	}
}

main();
