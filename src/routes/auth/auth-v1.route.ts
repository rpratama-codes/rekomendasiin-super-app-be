import express, { type Request, type Response } from 'express';
import { AuthV1Controller } from '../../controller/auth/auth-v1.controller.js';
import { limiter } from '../../middleware/limitter.js';
import { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import { MailService } from '../../services/mail/mail.service.js';
import { OtpService } from '../../services/otp/otp.service.js';
import { UserService } from '../../services/user/user.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';

const otpService = new OtpService();
const mailService = new MailService();
const userService = new UserService();
const authV1Service = new AuthV1Service();
const authV1Controller = new AuthV1Controller(
	authV1Service,
	mailService,
	otpService,
	userService,
);

const happyRouter = new HappyRouter({
	expressRouter: express.Router(),
	prefix: '/v1/auth',
	middlewares: [limiter],
	routes: [
		{
			path: '/sign-up',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.createUser(req, res),
			],
		},
		{
			path: '/otp/verify',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.verifyOTP(req, res),
			],
		},
	],
});

export const authRouteV1 = happyRouter.compass();
