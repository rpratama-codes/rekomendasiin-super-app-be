/** biome-ignore-all lint/correctness/noUnusedImports: <.> */
/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: <.> */

import { type User, UserRole } from '@prisma/client';
import argon2 from 'argon2';
import * as jose from 'jose';
import * as OTPAuth from 'otpauth';
import {
	ServiceBase,
	type ServiceBaseParams,
} from '../../utils/base-class/service.class.js';
import type { CreateUserDto, JwtPayload } from './auth-v1.dto.js';

export class AuthV1Service extends ServiceBase {
	public async createUser({
		email,
		password,
		first_name,
		last_name,
	}: CreateUserDto) {
		const currentUser = await this.prisma.user.findFirst({ where: { email } });

		if (currentUser) {
			throw this.errorSignal(409, 'User already registered!');
		}

		const [userName, _domain] = email.toLowerCase().split('@');

		const createUser = await this.prisma.user.create({
			data: {
				first_name: first_name as string | null,
				last_name: last_name as string | null,
				email,
				role: UserRole.user,
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
		user: Pick<User, 'id' | 'role'>,
		type: 'access' | 'refresh',
	) {
		const secret = new TextEncoder().encode(
			type === 'access'
				? process.env.APP_SECRET_ACCESS
				: process.env.APP_SECRET_REFRESH,
		);

		const jwt = await new jose.SignJWT({ role: user.role })
			.setSubject(user.id)
			.setExpirationTime(type === 'access' ? '7d' : '30d')
			.setProtectedHeader({ alg: 'HS256' })
			.sign(secret);

		return jwt;
	}

	public async refresh(refreshToken: string) {
		const secret = new TextEncoder().encode(process.env.APP_SECRET_REFRESH);

		let oldRefreshToken: jose.JWTVerifyResult<JwtPayload>;

		try {
			oldRefreshToken = await jose.jwtVerify<JwtPayload>(refreshToken, secret);
		} catch (error: unknown) {
			if (error instanceof jose.errors.JWTInvalid) {
				this.errorSignal(401, 'Please login again!.');
			}
			throw error;
		}

		return await this.signJWT(
			{ id: oldRefreshToken.payload.sub, role: oldRefreshToken.payload.role },
			'refresh',
		);
	}

	public async generateTOTP({ previousSecret }: { previousSecret?: string }) {
		/**
		 * This function to generate and regenerate Register or Login OTP.
		 *
		 * Note : 	if in the future the algoritm want to change,
		 * 			please make a middleware or migration scheme.
		 */
		const secret = new OTPAuth.Secret().hex;

		const totp = new OTPAuth.TOTP({
			issuer: 'Rekomendasiin',
			label: 'UserOTP',
			algorithm: 'SHA1',
			digits: 6,
			period: 15 * 60,
			secret: OTPAuth.Secret.fromHex(previousSecret ?? secret),
		});

		this.logger.debug('Totp : ', totp);

		return {
			otp: totp.generate(),
			secret: totp.secret,
		};
	}
}
