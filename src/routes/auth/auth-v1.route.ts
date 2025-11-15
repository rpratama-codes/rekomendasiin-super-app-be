import express, { type Request, type Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthV1Controller } from '../../controller/auth/auth-v1.controller.js';
import { apiLimiterMiddleware } from '../../middleware/api-limitter.middleware.js';
import { refreshMiddleware } from '../../middleware/auth.middleware.js';
import { AuthV1Service } from '../../services/auth/auth-v1.service.js';
import { MailService } from '../../services/mail/mail.service.js';
import { OtpService } from '../../services/otp/otp.service.js';
import { UserService } from '../../services/user/user.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { logger } from '../../utils/logger/winston.js';

const otpService = new OtpService();
const mailService = new MailService();
const userService = new UserService();
const oAuth2Client = new OAuth2Client({
	client_id: process.env.GOOGLE_CLIENT_ID as string,
	client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
});
const authV1Service = new AuthV1Service(oAuth2Client);
const authV1Controller = new AuthV1Controller(
	authV1Service,
	mailService,
	otpService,
	userService,
);
const happyLogger = (message: string) => {
	logger.info(message);
};

const happyRouter = new HappyRouter({
	expressRouter: express.Router(),
	prefix: '/v1/auth',
	middlewares: [apiLimiterMiddleware],
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/sign-up',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.signUp(req, res),
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
		{
			path: '/refresh',
			method: 'get',
			middlewares: [refreshMiddleware],
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.refreshToken(req, res),
			],
		},
		{
			path: '/sign-in',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.signIn(req, res),
			],
		},
		{
			path: '/google/verify',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authV1Controller.verifyGoogleLogin(req, res),
			],
		},
	],
});

export const authRouteV1 = happyRouter.compass();
