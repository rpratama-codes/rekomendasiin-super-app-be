import os from 'node:os';
import express, {
	type NextFunction,
	type Request,
	type Response,
} from 'express';
import '@dotenvx/dotenvx/config';
import helmet from 'helmet';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { authRouteV1 } from './routes/auth/auth-v1.route.js';
import { storeFrontRoute } from './routes/store-front/store-front.route.js';
import { userRoute } from './routes/user/user.route.js';
import { HappyApp, HappyRouter } from './utils/base-class/happy-router.js';
import { logger } from './utils/logger/winston.js';

const app = express();
const router = express.Router({
	mergeParams: true,
	caseSensitive: true,
	strict: true,
});

const happyLogger = (message: string) => {
	logger.info(message);
};

const happyRouter = new HappyRouter({
	prefix: '/api',
	expressRouter: router,
	middlewares: [storeFrontRoute, authRouteV1, userRoute],
	callbackLogger: happyLogger,
});

const happyApp = new HappyApp({
	appName: 'Rekomendasiin Backend',
	expressApplication: app,
	configs: { 'trust proxy': true },
	callbackLogger: happyLogger,
	middlewares: [
		helmet(),
		express.json(),
		loggerMiddleware,
		happyRouter.compass(),
	],
	errorHandlers: [errorHandlerMiddleware],
	routes: [
		{
			path: '/',
			handlers: [
				(_req: Request, res: Response, _nx: NextFunction) =>
					res.status(200).json({ code: 200, message: 'ok' }),
			],
		},
	],
});

happyApp.sail(Number(process.env.APP_PORT), () => {
	const hostname = os.hostname();
	logger.info(`App listening on http://${hostname}:${process.env.APP_PORT}`);
	logger.info(`App Information, pid: ${process.pid}, title: ${process.title} `);
});
