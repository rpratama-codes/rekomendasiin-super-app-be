import { render } from '@react-email/components';
import type { Request, Response } from 'express';
import { createUserDto } from '../../services/auth/auth-v1.dto.js';
import type { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import type { MailService } from '../../services/mail/mail.service.js';
import type { OtpService } from '../../services/otp/otp.service.js';
import RekomendasiinVerifyEmail from '../../templates/email-verification.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class AuthV1Controller extends ControllerBase {
	private authV1Service: AuthV1Service;
	private mailService: MailService;
	private otpService: OtpService;

	constructor({
		mailService,
		authV1Service,
		otpService,
	}: {
		mailService: MailService;
		authV1Service: AuthV1Service;
		otpService: OtpService;
	}) {
		super();
		this.mailService = mailService;
		this.authV1Service = authV1Service;
		this.otpService = otpService;
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
}
