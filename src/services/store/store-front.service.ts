import { ServiceBase } from '../../utils/base-class/service.class.js';
import type {
	Categories,
	Criterias,
	Items,
} from '../prisma/generated/client.js';
import type { DecisionSupportSystems } from '../suggesion/dss.service.js';

export class StoreFrontService extends ServiceBase {
	private dss: DecisionSupportSystems;

	constructor({ dss }: { dss: DecisionSupportSystems }) {
		super();
		this.dss = dss;
	}

	public async listCategory(): Promise<Categories[]> {
		const category = await this.prisma.categories.findMany();

		return category;
	}

	public async listCriteriaClient(): Promise<
		Pick<Criterias, 'id' | 'criteria_name'>[]
	> {
		const criteria = await this.prisma.criterias.findMany({
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
	}): Promise<{
		spec: Items[];
		result: Record<string, string | number | null>[];
		criteria: Criterias;
		comparable_criteria: string[];
	}> {
		const items = await this.prisma.items.findMany({
			where: {
				price: {
					gte: basePrice.min,
					lte: basePrice.max,
				},
			},
		});

		const criteria = await this.prisma.criterias.findFirst({
			where: {
				id: criteria_id,
			},
		});

		if (!criteria) {
			throw this.errorSignal(
				400,
				'Criteria Not Found, Please give correct criteria id.',
			);
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

		return {
			result: finalSaw,
			spec: items,
			criteria,
			comparable_criteria: Array.from(criteriaNames),
		};
	}
}
