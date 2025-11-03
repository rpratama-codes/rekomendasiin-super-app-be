import type { Category, Criteria } from '@prisma/client';
import type { Logger } from 'winston';
import { ServiceBase } from '../../utils/base-class/index.js';
import type { DecisionSupportSystems } from '../suggesion/dss.service.js';

export class StoreFrontService extends ServiceBase {
	private dss: DecisionSupportSystems;

	constructor({
		logger,
		dss,
	}: { logger: Logger; dss: DecisionSupportSystems }) {
		super({ logger });
		this.dss = dss;
	}

	public async listCategory(): Promise<Category[]> {
		const category = await this.prisma.category.findMany();

		return category;
	}

	public async listCriteriaClient(): Promise<
		Pick<Criteria, 'id' | 'criteria_name'>[]
	> {
		const criteria = await this.prisma.criteria.findMany({
			select: {
				id: true,
				criteria_name: true,
			},
		});

		return criteria;
	}

	public async listRecomendation({
		basePrice,
		criteria_id,
	}: {
		basePrice: {
			min: number;
			max: number;
		};
		criteria_id: string;
	}): Promise<Record<string, string | number | null>[]> {
		const items = await this.prisma.item.findMany({
			where: {
				price: {
					gte: basePrice.min,
					lte: basePrice.max,
				},
			},
		});

		const criteria = await this.prisma.criteria.findFirst({
			where: {
				id: criteria_id,
			},
		});

		if (!criteria) {
			throw new Error('Criteria Not Found, Please give correct criteria id.');
		}

		const criteriaNames = this.dss.criteriaPicker(criteria);

		const simpleAdditiveWeighting = this.dss.simpleAdditiveWeighting({
			criteriaNames,
			criteriaValues: criteria,
			items,
		});

		const finalSaw = this.dss.sumTotalScore({
			criteriaNames,
			items: simpleAdditiveWeighting,
		});

		return finalSaw;
	}
}
