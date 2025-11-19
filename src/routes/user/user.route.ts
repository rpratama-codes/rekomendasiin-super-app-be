import express, { type Request, type Response } from 'express';
import { UsersController } from '../../controller/user/user.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { UserService } from '../../services/user/user.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { logger } from '../../utils/logger/winston.js';

const router = express.Router();
const userService = new UserService();
const userController = new UsersController(userService);
const happyLogger = (message: string) => {
	logger.info(message);
};

const happyRouter = new HappyRouter({
	expressRouter: router,
	prefix: '/users',
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/profile',
			method: 'get',
			middlewares: [authMiddleware],
			handlers: [
				async (req: Request, res: Response) =>
					await userController.getProfile(req, res),
			],
		},
	],
});

export const userRoute = happyRouter.compass();
