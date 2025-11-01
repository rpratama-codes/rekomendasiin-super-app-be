import type { Criteria, Item } from '@prisma/client';

export class DecisionSupportSystems {
	public simpleAdditiveWeighting({
		criteria,
		items,
	}: {
		criteria: Omit<Criteria, 'id' | 'criteria_name' | 'category_id'>;
		items: Item[];
	}) {
		/**
		 * TODO: BREAK SAW METHOD INTO SMALLER PARTS!
		 */
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
					return {
						[key]: value,
					};
				}

				let normalValue = value;

				if (isCostOrBenefit.type === 'cost') {
					normalValue =
						(isCostOrBenefit.value / normalValue) *
						Number(criteria[key as keyof typeof criteria]);
				} else {
					normalValue =
						(normalValue / isCostOrBenefit.value) *
						Number(criteria[key as keyof typeof criteria]);
				}

				return {
					[key]: normalValue,
				};
			});

			const normalizationResult = normalizationSpecs.reduce(
				(accumulator, currentObject) => {
					// biome-ignore lint/performance/noAccumulatingSpread: <TODO : Change later!>
					return { ...accumulator, ...currentObject };
				},
				{},
			);

			return normalizationResult;
		});

		return normalizationItems;
	}
}
