import type { Request, Response } from 'express';
import { StoreFrontService } from '../service/store/store-front.service.js';
import { DecisionSupportSystems } from '../service/suggesion/dss.service.js';
import { ControllerBase } from '../utils/base-class/base-class.js';
import { logger } from '../utils/logger/winston.js';
import { storeFrontDto } from './store-front.dto.js';

export class StoreFrontController extends ControllerBase {
	private storeFrontService: StoreFrontService;

	constructor() {
		super({ logger });

		const dss = new DecisionSupportSystems();

		this.storeFrontService = new StoreFrontService({
			logger,
			dss,
		});
	}

	public async listCriteriaClient(_req: Request, res: Response) {
		const criterias = await this.storeFrontService.listCriteriaClient();

		return this.sendApiResponse(res, {
			status: 200,
			message: 'ok',
			data: criterias,
		});
	}

	public async listCategory(_req: Request, res: Response) {
		const category = await this.storeFrontService.listCategory();

		return this.sendApiResponse(res, {
			status: 200,
			message: 'ok',
			data: category,
		});
	}

	public async listRecommendation(req: Request, res: Response) {
		const { basePrice, criteria_id } = await storeFrontDto.parseAsync(req.body);

		const recommendation = await this.storeFrontService.listRecomendation({
			basePrice,
			criteria_id,
		});

		return this.sendApiResponse(res, {
			status: 200,
			message: 'ok',
			data: recommendation,
		});
	}
}
