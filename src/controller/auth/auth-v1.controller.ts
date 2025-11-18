import { render } from '@react-email/components';
import type { Request, Response } from 'express';
import {
	signInDto,
	signUpDto,
	verifyGoogleLoginDto,
	verifyOtpDto,
} from '../../services/auth/auth-v1.dto.js';
import type { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import type { MailService } from '../../services/mail/mail.service.js';
import type { ConfigOTP, OtpService } from '../../services/otp/otp.service.js';
import type { UserService } from '../../services/user/user.service.js';
import RekomendasiinVerifyEmail from '../../templates/email-verification.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class AuthV1Controller extends ControllerBase {
	constructor(
		private readonly authV1Service: AuthV1Service,
		private readonly mailService: MailService,
		private readonly otpService: OtpService,
		private readonly userService: UserService,
	) {
		super();
	}

	public async signUp(req: Request, res: Response) {
		const dto = await signUpDto.parseAsync(req.body);
		const create = await this.authV1Service.signUp(dto);
		const otp = await this.otpService.generateTOTP();

		const emailHtml = await render(
			RekomendasiinVerifyEmail({ verificationCode: otp.token }),
		);

		await this.mailService.send({
			to: create.email,
			subject: 'Email Verification',
			html: emailHtml,
		});

		await this.otpService.storeTOTP(create.id, otp);

		return this.sendApiResponse(res, { status: 200, data: create });
	}

	/**
	 * Please use rate limiter!
	 */
	public async verifyOTP(req: Request, res: Response) {
		const dto = await verifyOtpDto.parseAsync(req.body);
		const user = await this.userService.getUser({ email: dto.email });

		if (!user) {
			throw this.errorSignal(404, 'User not registered.');
		}

		if (user.verified) {
			throw this.errorSignal(403, 'User already verified.');
		}

		const config = await this.otpService.retriveTOTP(user.id);

		if (!config) {
			throw this.errorSignal(500);
		}

		const check = this.otpService.verifyTOTP(
			dto.token,
			config.secret,
			config.config as ConfigOTP,
		);

		if (!check) {
			throw this.errorSignal(400, 'Wrong OTP!.');
		}

		await Promise.all([
			this.otpService.invalidateTOTP(config.id),
			this.userService.markUserAsActive(user.id),
		]);

		const token = Array.from<'access' | 'refresh'>(['access', 'refresh']).map(
			async (tokenType) =>
				await this.authV1Service.signJWT(
					{ id: user.id, role: user.role },
					tokenType,
				),
		);

		const [access_token, refresh_token] = await Promise.all(token);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				user,
				access_token,
				refresh_token,
			},
		});
	}

	public async signIn(req: Request, res: Response) {
		const dto = await signInDto.parseAsync(req.body);
		const { user, access_token, refresh_token } =
			await this.authV1Service.signIn(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				user,
				access_token,
				refresh_token,
			},
		});
	}

	public async refreshToken(_req: Request, res: Response) {
		if (!res.locals.user) {
			throw this.errorSignal(500, 'No user provided!.');
		}

		const { role, sub } = res.locals.user;
		const [access_token, refresh_token, user] = await Promise.all([
			this.authV1Service.signJWT({ id: sub, role }, 'access'),
			this.authV1Service.signJWT({ id: sub, role }, 'refresh'),
			this.userService.getUser({ id: sub }),
		]);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				user,
				access_token,
				refresh_token,
			},
		});
	}

	public async verifyGoogleLogin(req: Request, res: Response) {
		const dto = await verifyGoogleLoginDto.parseAsync(req.body);
		const profile = await this.authV1Service.verifyGoogleLogin(dto.idToken);

		if (!profile?.email) {
			throw this.errorSignal(
				403,
				'Account without email address is not allowed to login!.',
			);
		}

		let user = await this.userService.getUser({ email: profile.email });

		if (!user) {
			user = await this.authV1Service.signUpByGoogleAccount({
				email: profile.email,
				first_name: profile.given_name ?? null,
				last_name: profile.family_name ?? null,
				google_account_id: profile.sub,
				image: profile.picture ? profile?.picture : null,
			});
		}

		if (!user.google_account_id) {
			await this.userService.addGoogleAccountId(user.id, profile.sub);
		}

		const { role, id } = user;
		const [access_token, refresh_token] = await Promise.all([
			this.authV1Service.signJWT({ id, role }, 'access'),
			this.authV1Service.signJWT({ id, role }, 'refresh'),
		]);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				user,
				access_token,
				refresh_token,
			},
		});
	}
}
