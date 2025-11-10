import type { Request, Response } from 'express';
import { storeFrontDto } from '../../services/store/store-front.dto.js';
import type { StoreFrontService } from '../../services/store/store-front.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class StoreFrontController extends ControllerBase {
	private storeFrontService: StoreFrontService;

	constructor({ storeFrontService }: { storeFrontService: StoreFrontService }) {
		super();
		this.storeFrontService = storeFrontService;
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
