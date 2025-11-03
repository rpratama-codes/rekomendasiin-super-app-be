import express, { type Request, type Response } from 'express';
import { StoreFrontController } from '../controller/store-front.controller.js';

const storeFrontRoute = express.Router();
const storeFrontService = new StoreFrontController();

storeFrontRoute.use(express.json());

storeFrontRoute.get(
	'/store-front/list-category',
	async (req: Request, res: Response) =>
		await storeFrontService.listCategory(req, res),
);

storeFrontRoute.get(
	'/store-front/list-criteria',
	async (req: Request, res: Response) =>
		await storeFrontService.listCriteriaClient(req, res),
);

storeFrontRoute.post(
	'/store-front/list-recomendation',
	async (req: Request, res: Response) =>
		await storeFrontService.listRecommendation(req, res),
);

export { storeFrontRoute };
