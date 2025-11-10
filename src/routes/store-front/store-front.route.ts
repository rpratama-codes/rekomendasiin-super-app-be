import express, { type Request, type Response } from 'express';
import { StoreFrontController } from '../../controller/store-front/store-front.controller.js';
import { StoreFrontService } from '../../services/store/store-front.service.js';
import { DecisionSupportSystems } from '../../services/suggesion/dss.service.js';

const dss = new DecisionSupportSystems();
const storeFrontService = new StoreFrontService({ dss });
const storeFrontController = new StoreFrontController({ storeFrontService });

const storeFrontRoute = express.Router();

storeFrontRoute.get(
	'/store-front/list-category',
	async (req: Request, res: Response) =>
		await storeFrontController.listCategory(req, res),
);

storeFrontRoute.get(
	'/store-front/list-criteria',
	async (req: Request, res: Response) =>
		await storeFrontController.listCriteriaClient(req, res),
);

storeFrontRoute.post(
	'/store-front/list-recomendation',
	async (req: Request, res: Response) =>
		await storeFrontController.listRecommendation(req, res),
);

export { storeFrontRoute };
