import express, { type Request, type Response } from 'express';
import { StoreFrontController } from '../../controller/store-front/store-front.controller.js';
import { SimpleAdditiveWeighting } from '../../services/saw/saw.service.js';
import { StoreFrontService } from '../../services/store-front/store-front.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { happyLogger } from '../../utils/logger/winston.js';

const sawService = new SimpleAdditiveWeighting();
const storeFrontService = new StoreFrontService();
const storeFrontController = new StoreFrontController(
	storeFrontService,
	sawService,
);

const happyRouter = new HappyRouter({
	expressRouter: express.Router(),
	prefix: '/store-front',
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/list-category',
			method: 'get',
			handlers: [
				async (req: Request, res: Response) =>
					await storeFrontController.listCategory(req, res),
			],
		},
		{
			path: '/list-criteria',
			method: 'get',
			handlers: [
				async (req: Request, res: Response) =>
					await storeFrontController.listCriteriaClient(req, res),
			],
		},
		{
			path: '/list-recomendation',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await storeFrontController.listRecommendation(req, res),
			],
		},
	],
});

export const storeFrontRoute = happyRouter.compass();
