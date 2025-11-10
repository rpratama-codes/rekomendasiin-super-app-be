import express, { type Request, type Response } from 'express';
import { AuthV1Controller } from '../../controller/auth/auth-v1.controller.js';
import { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import { MailService } from '../../services/mail/mail.service.js';
import { OtpService } from '../../services/otp/otp.service.js';

const otpService = new OtpService();
const mailService = new MailService();
const authV1Service = new AuthV1Service();
const authV1Controller = new AuthV1Controller({
	otpService,
	mailService,
	authV1Service,
});

const authRouteV1 = express.Router();

authRouteV1.use('/v1/auth/', authRouteV1);

authRouteV1.post('/sign-up', async (req: Request, res: Response) => {
	return await authV1Controller.createUser(req, res);
});

export { authRouteV1 };
