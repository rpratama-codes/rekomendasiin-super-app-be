import type { Request, Response } from 'express';
import type { SimpleAdditiveWeighting } from '../../services/saw/saw.service.js';
import { storeFrontDto } from '../../services/store-front/store-front.dto.js';
import type { StoreFrontService } from '../../services/store-front/store-front.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class StoreFrontController extends ControllerBase {
	constructor(
		private readonly storeFrontService: StoreFrontService,
		private readonly sawService: SimpleAdditiveWeighting,
	) {
		super();
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
		const { criteria, items } =
			await this.storeFrontService.CriteriaAndItemsForRecomendation({
				basePrice,
				criteria_id,
			});

		if (!criteria) {
			throw this.errorSignal(
				400,
				'Criteria Not Found, Please give correct criteria id.',
			);
		}

		const criteriaNames = this.sawService.criteriaPicker(criteria);

		const { costAndBenefit, filteredItems } =
			this.sawService.determinatingCostAndBenefit({
				criteriaNames,
				items,
			});

		const normalizationOrWeighting = this.sawService.normalizationOrWeighting({
			costAndBenefit,
			filteredItems,
			criteria,
		});

		const finalSaw = this.sawService.sumTotalScore({
			criteriaNames,
			items: normalizationOrWeighting,
		});

		return this.sendApiResponse(res, {
			status: 200,
			message: 'ok',
			data: {
				result: finalSaw,
				spec: items,
				criteria,
				comparable_criteria: Array.from(criteriaNames),
			},
		});
	}
}
