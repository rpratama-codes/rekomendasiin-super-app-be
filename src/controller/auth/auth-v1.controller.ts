import { render } from '@react-email/components';
import type { Request, Response } from 'express';
import { createUserDto } from '../../services/auth/auth-v1.dto.js';
import type { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import type { MailService } from '../../services/mail/mail.service.js';
import RekomendasiinVerifyEmail from '../../templates/email-verification.js';
import {
	ControllerBase,
	type ControllerBaseParams,
} from '../../utils/base-class/controller.class.js';

export class AuthV1Controller extends ControllerBase {
	private authV1Service: AuthV1Service;
	private mailService: MailService;

	constructor({
		logger,
		mailService,
		authV1Service,
	}: {
		mailService: MailService;
		authV1Service: AuthV1Service;
	} & ControllerBaseParams) {
		super({ logger });
		this.mailService = mailService;
		this.authV1Service = authV1Service;
	}

	public async createUser(req: Request, res: Response) {
		const dto = await createUserDto.parseAsync(req.body);
		const create = await this.authV1Service.createUser(dto);
		const otp = await this.authV1Service.generateTOTP();

		const emailHtml = await render(
			RekomendasiinVerifyEmail({ verificationCode: otp.otp }),
		);

		await this.mailService.send({
			to: create.email,
			subject: 'Email Verification',
			html: emailHtml,
		});

		await this.authV1Service.storeTOTP({
			user_id: create.id,
			secret: otp.secret,
			algorithm: otp.algorithm,
			expired_at: otp.expired_at,
		});

		return this.sendApiResponse(res, { status: 200, data: create });
	}
}
