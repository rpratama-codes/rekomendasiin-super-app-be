/** biome-ignore-all lint/correctness/noUnusedImports: <.> */
/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: <.> */

import argon2 from 'argon2';
import type { OAuth2Client } from 'google-auth-library';
import * as jose from 'jose';
import ms from 'ms';
import { ServiceBase } from '../../utils/base-class/service.class.js';
import type { Users } from '../prisma/generated/client.js';
import { UserRoles } from '../prisma/generated/enums.js';
import type { SignInDto, SignUpDto } from './auth-v1.dto.js';

export class AuthV1Service extends ServiceBase {
	constructor(private readonly oAuth2Client: OAuth2Client) {
		super();
	}

	public async signUpByGoogleAccount({
		email,
		first_name,
		last_name,
		google_account_id,
		image,
	}: Omit<SignUpDto, 'password'> & {
		google_account_id: string;
		image: string | null;
	}) {
		const [userName, _domain] = email.toLowerCase().split('@');

		const createUser = await this.prisma.users.create({
			data: {
				first_name: first_name as string | null,
				last_name: last_name as string | null,
				email,
				role: UserRoles.user,
				username: `${userName}+${Date.now()}`,
				google_account_id,
				verified: true,
				image,
			},
			omit: {
				password: true,
			},
		});

		return createUser;
	}

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
		const expTime = type === 'access' ? ms('60s') : ms('30d');

		const jwt = await new jose.SignJWT({ role: user.role })
			.setSubject(user.id)
			.setExpirationTime(Math.floor(Date.now() + expTime / 1000))
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

	public async verifyGoogleLogin(idToken: string) {
		const ticket = await this.oAuth2Client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID as string,
		});

		const payload = ticket.getPayload();
		return payload;
	}
}
