import type { Criteria, Item } from '@prisma/client';

export type NormalizationItem = {
	[x: string]: string | number | null;
};

export type CriteriaO = Omit<Criteria, 'id' | 'criteria_name' | 'category_id'>;

export class DecisionSupportSystems {
	public criteriaPicker(criteria: CriteriaO): Set<string> {
		const criteriaNames = Object.entries(criteria).reduce(
			(acc, [key, value]) => {
				if (typeof value === 'number' && value !== 0) {
					acc.add(key);
				}

				return acc;
			},
			new Set<string>(),
		);

		return criteriaNames;
	}

	public simpleAdditiveWeighting({
		criteriaNames,
		criteriaValues,
		items,
		output = 'weighting',
	}: {
		criteriaNames: Set<string>;
		criteriaValues: CriteriaO;
		items: Item[];
		output?: 'normalization' | 'weighting';
	}): NormalizationItem[] {
		/**
		 * TODO: BREAK SAW METHOD INTO SMALLER PARTS!
		 */
		const selectedItems = items.filter(
			(item) =>
				!Object.entries(item).some(
					([key, value]) => criteriaNames.has(key) && value === null,
				),
		);

		const costBenefitAggregator: { [key: string]: number } = {
			price: Infinity,
		};

		criteriaNames.forEach((name) => {
			if (name !== 'price') {
				costBenefitAggregator[name] = -Infinity;
			}
		});

		// 2. Iterate through the items ONCE to find the min price and max benefits.
		for (const item of selectedItems) {
			for (const name of criteriaNames) {
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

		const costBenefit = Object.entries(costBenefitAggregator).map(
			([name, value]) => ({
				name,
				value,
				type: name === 'price' ? 'cost' : 'benefit',
			}),
		);

		const normalizationItems = Array.from(selectedItems).map((ni) => {
			const normalizationSpecs = Object.entries(ni).map(([key, value]) => {
				const isCostOrBenefit = costBenefit.find((cob) => cob.name === key);

				const specNotFound = !isCostOrBenefit;
				const otherValue = typeof value !== 'number';

				if (specNotFound || otherValue) {
					return [key, value];
				}

				let weight = Number(criteriaValues[key as keyof typeof criteriaValues]);

				if (output === 'normalization') {
					weight = 1;
				}

				let normalValue: string | number | null = value;

				if (isCostOrBenefit.type === 'cost') {
					normalValue = (isCostOrBenefit.value / normalValue) * weight;
				} else {
					normalValue = (normalValue / isCostOrBenefit.value) * weight;
				}

				return [key, normalValue];
			});

			const normalizationResult = Object.fromEntries(normalizationSpecs);

			return normalizationResult;
		});

		return normalizationItems;
	}

	public sumTotalScore({
		criteriaNames,
		items,
	}: {
		criteriaNames: Set<string>;
		items: NormalizationItem[];
	}): NormalizationItem[] {
		const unsortScore = items.map((item) => {
			const totalScore = Object.entries(item).reduce((acc, [key, value]) => {
				if (criteriaNames.has(key) && typeof value === 'number') {
					return acc + value;
				}
				return acc;
			}, 0);

			return {
				...item,
				totalScore,
			};
		});

		const sortedScore = unsortScore.sort((a, b) => b.totalScore - a.totalScore);

		return sortedScore;
	}
}
