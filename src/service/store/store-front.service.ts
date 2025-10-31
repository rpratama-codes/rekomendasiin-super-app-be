import type { Category, Criteria, Item } from '@prisma/client';
import { ServiceBase } from '../../utils/base-class/index.ts';

export class StoreFront extends ServiceBase {
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
	}): Promise<Item[] | undefined> {
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

		const criteriaSet = Object.entries(criteria).reduce((acc, [key, value]) => {
			if (typeof value === 'number' && value !== 0) {
				acc.add(key);
			}

			return acc;
		}, new Set<string>());

		const selectedItems = items.filter(
			(item) =>
				!Object.entries(item).some(
					([key, value]) => criteriaSet.has(key) && value === null,
				),
		);

		const costBenefitAggregator: { [key: string]: number } = {
			price: Infinity,
		};

		criteriaSet.forEach((name) => {
			if (name !== 'price') {
				costBenefitAggregator[name] = -Infinity;
			}
		});

		// 2. Iterate through the items ONCE to find the min price and max benefits.
		for (const item of selectedItems) {
			for (const name of criteriaSet) {
				const value = item[name as keyof typeof item] as number;

				const criteriaValue = costBenefitAggregator[name] as number;

				// If it's a cost ('price'), we want the minimum value.
				if (name === 'price') {
					if (value < criteriaValue) {
						costBenefitAggregator[name] = value;
					}
				}
				// Otherwise, it's a benefit, and we want the maximum value.
				else {
					if (value > criteriaValue) {
						costBenefitAggregator[name] = value;
					}
				}
			}
		}

		// 3. Transform the aggregated results into the final desired format.
		const constBenefit = Object.entries(costBenefitAggregator).map(
			([name, value]) => ({
				name,
				value,
				type: name === 'price' ? 'cost' : 'benefit',
			}),
		);

		return [];
	}
}
