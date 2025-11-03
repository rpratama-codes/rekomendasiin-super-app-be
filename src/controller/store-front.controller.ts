import type { Request, Response } from 'express';
import { StoreFrontService } from '../service/store/store-front.service.js';
import { DecisionSupportSystems } from '../service/suggesion/dss.service.js';
import { ControllerBase } from '../utils/base-class/index.js';
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
		try {
			const criterias = await this.storeFrontService.listCriteriaClient();

			return this.sendApiResponse(res, {
				status: 200,
				message: 'ok',
				data: criterias,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(error);
			}

			this.sendErrorResponse(res, {
				status: 500,
				message: 'internal server error',
			});
		}
	}

	public async listCategory(_req: Request, res: Response) {
		try {
			const category = await this.storeFrontService.listCategory();

			return this.sendApiResponse(res, {
				status: 200,
				message: 'ok',
				data: category,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(error);
			}

			this.sendErrorResponse(res, {
				status: 500,
				message: 'internal server error',
			});
		}
	}

	public async listRecommendation(req: Request, res: Response) {
		try {
			const { basePrice, criteria_id } = await storeFrontDto.parseAsync(
				req.body,
			);

			const recommendation = await this.storeFrontService.listRecomendation({
				basePrice,
				criteria_id,
			});

			return this.sendApiResponse(res, {
				status: 200,
				message: 'ok',
				data: recommendation,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(error);
			}

			this.sendErrorResponse(res, {
				status: 500,
				message: 'internal server error',
			});
		}
	}
}
