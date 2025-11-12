import express, { type Request, type Response } from 'express';
import { StoreFrontController } from '../../controller/store-front/store-front.controller.js';
import { StoreFrontService } from '../../services/store/store-front.service.js';
import { DecisionSupportSystems } from '../../services/suggesion/dss.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';

const dss = new DecisionSupportSystems();
const storeFrontService = new StoreFrontService({ dss });
const storeFrontController = new StoreFrontController({ storeFrontService });

const happyRouter = new HappyRouter({
	expressRouter: express.Router(),
	prefix: '/store-front',
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
