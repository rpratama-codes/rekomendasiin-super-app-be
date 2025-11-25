import { ServiceBase } from '../../utils/base-class/service.class.js';
import type {
	Categories,
	Criterias,
	Items,
} from '../prisma/generated/client.js';
import type {
	ItemWithScore,
	SimpleAdditiveWeighting,
} from '../saw/saw.service.js';

export class StoreFrontService extends ServiceBase {
	private saw: SimpleAdditiveWeighting;

	constructor({ saw }: { saw: SimpleAdditiveWeighting }) {
		super();
		this.saw = saw;
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
		result: ItemWithScore[];
		criteria: Criterias;
		comparable_criteria: string[];
	}> {
		const [items, criteria] = await Promise.all([
			this.prisma.items.findMany({
				where: {
					price: {
						gte: basePrice.min,
						lte: basePrice.max,
					},
				},
				orderBy: {
					price: 'desc',
				},
			}),
			this.prisma.criterias.findFirst({
				where: {
					id: criteria_id,
				},
			}),
		]);

		if (!criteria) {
			throw this.errorSignal(
				400,
				'Criteria Not Found, Please give correct criteria id.',
			);
		}

		const criteriaNames = this.saw.criteriaPicker(criteria);

		const { costAndBenefit, filteredItems } =
			this.saw.determinatingCostAndBenefit({
				criteriaNames,
				items,
			});

		const normalizationOrWeighting = this.saw.normalizationOrWeighting({
			costAndBenefit,
			filteredItems,
			criteria,
		});

		const finalSaw = this.saw.sumTotalScore({
			criteriaNames,
			items: normalizationOrWeighting,
		});

		return {
			result: finalSaw,
			spec: items,
			criteria,
			comparable_criteria: Array.from(criteriaNames),
		};
	}
}
