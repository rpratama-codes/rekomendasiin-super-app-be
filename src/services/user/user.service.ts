import { ServiceBase } from '../../utils/base-class/service.class.js';
import type { RequireAtLeastOne } from '../../utils/types/tsypes.js';

type userIdentifier = { id: string; email: string };

export class UserService extends ServiceBase {
	public async getUser(identifier: RequireAtLeastOne<userIdentifier>) {
		return await this.prisma.users.findFirst({
			where: {
				...(identifier as userIdentifier),
			},
			omit: {
				password: true,
			},
		});
	}

	public async markUserAsActive(user_id: string): Promise<void> {
		await this.prisma.users.update({
			where: {
				id: user_id,
			},
			data: {
				verified: true,
			},
		});
	}
}
