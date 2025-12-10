import express, { type Request, type Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthController } from '../../controller/auth/auth.controller.js';
import { apiLimiterMiddleware } from '../../middleware/api-limitter.middleware.js';
import { refreshMiddleware } from '../../middleware/auth.middleware.js';
import { AuthService } from '../../services/auth/auth.service.js';
import { MailService } from '../../services/mail/mail.service.js';
import { OtpService } from '../../services/otp/otp.service.js';
import { UserService } from '../../services/user/user.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { happyLogger } from '../../utils/logger/winston.js';

const otpService = new OtpService();
const mailService = new MailService();
const userService = new UserService();
const oAuth2Client = new OAuth2Client({
	client_id: process.env.GOOGLE_CLIENT_ID as string,
	client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
});
const authService = new AuthService(oAuth2Client);
const authController = new AuthController(
	authService,
	mailService,
	otpService,
	userService,
);

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
					await authController.signUp(req, res),
			],
		},
		{
			path: '/otp/verify',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authController.verifyOTP(req, res),
			],
		},
		{
			path: '/refresh',
			method: 'get',
			middlewares: [refreshMiddleware],
			handlers: [
				async (req: Request, res: Response) =>
					await authController.refreshToken(req, res),
			],
		},
		{
			path: '/sign-in',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authController.signIn(req, res),
			],
		},
		{
			path: '/google/verify',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await authController.verifyGoogleLogin(req, res),
			],
		},
	],
});

export const authRouteV1 = happyRouter.compass();
