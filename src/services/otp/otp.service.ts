import * as OTPAuth from 'otpauth';
import { ServiceBase } from '../../utils/base-class/service.class.js';

export type ConfigOTP = {
	algorithm: string;
	digits: number;
	period: number;
};

export type GeneratedOTP = {
	token: string;
	secret: string;
	config: ConfigOTP;
	expired_at: Date;
};

export class OtpService extends ServiceBase {
	/**
	 * This function to generate and regenerate Register or Login OTP.
	 * This method not mean for 2FA, please make another method!.
	 *
	 * Note : 	if in the future the algoritm want to change,
	 * 			please make a middleware or migration scheme.
	 */
	public async generateTOTP(payload?: {
		previousSecret?: string;
	}): Promise<GeneratedOTP> {
		const baseConfig = {
			algorithm: 'SHA1',
			digits: 6,
			period: 15 * 60,
		};

		const totp = new OTPAuth.TOTP({
			...baseConfig,
			secret: payload?.previousSecret
				? OTPAuth.Secret.fromHex(payload.previousSecret)
				: new OTPAuth.Secret(),
		});

		return {
			token: totp.generate(),
			secret: totp.secret.hex,
			config: baseConfig,
			expired_at: new Date(Date.now() + 15 * 60 * 1000),
		};
	}

	public async storeTOTP(
		user_id: string,
		payload: GeneratedOTP,
	): Promise<void> {
		await this.prisma.oneTimeTokenSecrets.create({
			data: {
				config: payload.config,
				expired_at: payload.expired_at,
				secret: payload.secret,
				user_id,
			},
		});
	}

	public async retriveTOTP(user_id: string) {
		return await this.prisma.oneTimeTokenSecrets.findFirst({
			where: {
				user_id,
				expired_at: {
					gte: new Date(),
				},
			},
		});
	}

	/**
	 *
	 * @param token
	 * @param secret
	 * @param config
	 * @returns boolean
	 */
	public verifyTOTP(token: string, secret: string, config: ConfigOTP): boolean {
		const totp = new OTPAuth.TOTP({
			...config,
			secret: OTPAuth.Secret.fromHex(secret),
		});

		const verify = totp.validate({ token });
		let isValid = false;

		if (verify === 0) {
			isValid = true;
		}

		return isValid;
	}

	public async invalidateTOTP(token_id: string): Promise<void> {
		await this.prisma.oneTimeTokenSecrets.update({
			where: {
				id: token_id,
			},
			data: {
				expired_at: new Date(),
			},
		});
	}

	public async appendTimeUsed(token_id: string): Promise<void> {
		await this.prisma.oneTimeTokenSecrets.update({
			where: {
				id: token_id,
			},
			data: {
				time_used: {
					increment: 1,
				},
			},
		});
	}

	// TODO : Regenerate and resend TOTP
}
