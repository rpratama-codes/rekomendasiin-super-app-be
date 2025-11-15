/** biome-ignore-all lint/correctness/noUnusedImports: <.> */
/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: <.> */

import argon2 from 'argon2';
import * as jose from 'jose';
import ms from 'ms';
import { ServiceBase } from '../../utils/base-class/service.class.js';
import type { Users } from '../prisma/generated/client.js';
import { UserRoles } from '../prisma/generated/enums.js';
import type { SignInDto, SignUpDto } from './auth-v1.dto.js';

export class AuthV1Service extends ServiceBase {
	public async signUp({ email, password, first_name, last_name }: SignUpDto) {
		const currentUser = await this.prisma.users.findFirst({ where: { email } });

		if (currentUser) {
			throw this.errorSignal(409, 'User already registered!');
		}

		const [userName, _domain] = email.toLowerCase().split('@');

		const createUser = await this.prisma.users.create({
			data: {
				first_name: first_name as string | null,
				last_name: last_name as string | null,
				email,
				role: UserRoles.user,
				username: `${userName}+${Date.now()}`,
				password: await argon2.hash(password),
			},
			omit: {
				password: true,
			},
		});

		return createUser;
	}

	public async signJWT(
		user: Pick<Users, 'id' | 'role'>,
		type: 'access' | 'refresh',
	) {
		const secret = new TextEncoder().encode(
			type === 'access'
				? process.env.APP_SECRET_ACCESS
				: process.env.APP_SECRET_REFRESH,
		);

		/**
		 * Don't directly set `setExpirationTime` with 7d or else!
		 * because jose using second format but node is using milisecond format,
		 * that will causing missmatch format!.
		 */
		const expTime = type === 'access' ? ms('7d') : ms('30d');

		const jwt = await new jose.SignJWT({ role: user.role })
			.setSubject(user.id)
			.setExpirationTime(Date.now() + expTime)
			.setProtectedHeader({ alg: 'HS256' })
			.sign(secret);

		return jwt;
	}

	public checkUser(user: Partial<Users> | null): Users & { password: string } {
		if (!user) {
			throw this.errorSignal(404, 'User not registered.');
		}

		if (!user.verified) {
			throw this.errorSignal(403, 'Please verify your email!');
		}

		if (!user.password) {
			throw this.errorSignal(403, 'Please login using another provider!');
		}

		return user as Users & { password: string };
	}

	public async signIn(payload: SignInDto) {
		const getUser = await this.prisma.users.findFirst({
			where: {
				email: payload.email,
			},
		});

		const user = this.checkUser(getUser);
		const [verify, access_token, refresh_token] = await Promise.all([
			argon2.verify(user.password, payload.password),
			this.signJWT({ id: user.id, role: user.role }, 'access'),
			this.signJWT({ id: user.id, role: user.role }, 'refresh'),
		]);

		if (!verify) {
			throw this.errorSignal(401, 'Please check your login credential!.');
		}

		return {
			user: { ...user, password: undefined },
			access_token,
			refresh_token,
		};
	}
}
