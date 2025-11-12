import { render } from '@react-email/components';
import type { Request, Response } from 'express';
import {
	createUserDto,
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

	public async createUser(req: Request, res: Response) {
		const dto = await createUserDto.parseAsync(req.body);
		const create = await this.authV1Service.createUser(dto);
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

		const config = await this.otpService.retriveTOTP(user.id);

		if (!config) {
			throw this.errorSignal(404, 'User not registered.');
		}

		const check = this.otpService.verifyTOTP(
			dto.token,
			config.secret,
			config.config as ConfigOTP,
		);

		if (!check) {
			throw this.errorSignal(400, 'Wrong OTP!.');
		}

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
}
