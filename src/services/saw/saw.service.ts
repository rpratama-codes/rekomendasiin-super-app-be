import type { Criterias, Items } from '../prisma/generated/client.js';

/**
 * Represents an item that has gone through the SAW process and includes
 * a final calculated score.
 */
export type ItemWithScore = Items & { totalScore: number };

/**
 * A subset of the Criterias model, excluding metadata fields like timestamps
 * and category IDs.
 */
export type CriteriaWithOmittedKey<T = Criterias> = Omit<
	T,
	'id' | 'criteria_name' | 'category_id' | 'created_at' | 'updated_at'
>;

/**
 * structure holding the threshold value for a specific criteria.
 * @property type - Strictly typed as 'cost' or 'benefit' to determine the calculation formula.
 */
export type CostAndBenefit = {
	name: string;
	value: number;
	type: 'cost' | 'benefit';
};

/**
 * Implements the Simple Additive Weighting (SAW) method for decision support.
 * This class handles criteria selection, normalization, weighting, and final scoring.
 */
export class SimpleAdditiveWeighting {
	/**
	 * Selects valid criteria for the calculation process.
	 * It filters out criteria that are null or have a weight of zero.
	 *
	 * @param {CriteriaO} criteria - The stored criteria object from the database.
	 * @returns {Set<string>} A Set containing the names of the active criteria.
	 */
	public criteriaPicker(criteria: CriteriaWithOmittedKey): Set<string> {
		/**
		 * From criteria on the db it will filtering the value that not null and zero.
		 * That mean it's the criteria, that will be compare later.
		 */
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

	/**
	 * Prepares data for the SAW process by filtering invalid items and calculating
	 * the Min/Max thresholds required for normalization.
	 *
	 * @param {Object} params - The input parameters.
	 * @param {Set<string>} params.criteriaNames - The active criteria to evaluate.
	 * @param {CriteriaO} params.criteriaValues - The raw criteria values (weights) from DB.
	 * @param {Items[]} params.items - The list of items to evaluate.
	 * @param {'normalization' | 'weighting'} [params.output] - Optional flag (unused in this specific step but part of the pipeline).
	 *
	 * @returns {{ costAndBenefit: CostAndBenefit[]; filteredItems: Items[] }}
	 * An object containing:
	 * - `filteredItems`: Items that have valid data for all active criteria.
	 * - `costAndBenefit`: Array defining if a criteria is a 'cost' (Min needed) or 'benefit' (Max needed) and its threshold value.
	 */
	public determinatingCostAndBenefit({
		criteriaNames,
		items,
	}: {
		criteriaNames: Set<string>;
		items: Items[];
	}): { costAndBenefit: CostAndBenefit[]; filteredItems: Items[] } {
		/**
		 * 1. Filtering item that not contain some criteria value.
		 * This ensures we don't calculate scores for incomplete data.
		 */
		const filteredItems = items.filter(
			(item) =>
				!Object.entries(item).some(
					([key, value]) => criteriaNames.has(key) && value === null,
				),
		);

		const costBenefitAggregator: { [key: string]: number } = {
			price: Infinity,
		};

		criteriaNames.forEach((name) => {
			/**
			 * 	NOTE: The variable still harcoded
			 *  TODO: create cost definition on db.
			 */
			if (name !== 'price') {
				costBenefitAggregator[name] = -Infinity;
			}
		});

		/**
		 * 2. Iterate through the items ONCE to find the min price and max benefits.
		 * This aggregator is required for the normalization formula.
		 */
		for (const item of filteredItems) {
			for (const name of criteriaNames) {
				const value = item[name as keyof typeof item] as number;
				const criteriaValue = costBenefitAggregator[name] as number;

				/** If it's a cost ('price'), we want the minimum value. */
				if (name === 'price') {
					if (value < criteriaValue) {
						costBenefitAggregator[name] = value;
					}
				} else {
					/** Otherwise, it's a benefit, and we want the maximum value. */
					if (value > criteriaValue) {
						costBenefitAggregator[name] = value;
					}
				}
			}
		}

		const costAndBenefit: CostAndBenefit[] = Object.entries(
			costBenefitAggregator,
		).map(([name, value]) => ({
			name,
			value,
			type: name === 'price' ? 'cost' : 'benefit',
		}));

		return { costAndBenefit, filteredItems };
	}

	/**
	 * Executes the core SAW calculation formulas.
	 * Can perform raw normalization (0-1 scale) or weighted normalization.
	 *
	 * Formulas used:
	 * - **Cost:** (Min / Value) * Weight
	 * - **Benefit:** (Value / Max) * Weight
	 *
	 * @param {Object} params - The input parameters.
	 * @param {CriteriaWithOmittedKey} params.criteriaValues - object containing the weights for each criteria.
	 * @param {'normalization' | 'weighting'} [params.output='weighting'] - Determines if weights are applied (default) or if pure normalization (weight=1) is returned.
	 * @param {CostAndBenefit[]} params.costAndBenefit - The Min/Max thresholds derived from `determinatingCostAndBenefit`.
	 * @param {Items[]} params.filteredItems - The clean list of items to process.
	 *
	 * @returns {Items[]} A list of items where the criteria fields are replaced by their calculated scores.
	 */
	public normalizationOrWeighting({
		criteria,
		output = 'weighting',
		costAndBenefit,
		filteredItems,
	}: {
		criteria: CriteriaWithOmittedKey;
		output?: 'normalization' | 'weighting';
		costAndBenefit: CostAndBenefit[];
		filteredItems: Items[];
	}): Items[] {
		return filteredItems.map((item) => {
			/**
			 * 1. Create a shallow copy.
			 * TS preserves the 'Items' type here, so we don't lose type safety.
			 */
			const calculatedItem = { ...item };

			/**
			 * 2. Iterate ONLY over the relevant criteria found in costAndBenefit.
			 * This avoids iterating over 'id', 'created_at', etc.
			 */
			for (const cob of costAndBenefit) {
				const key = cob.name as keyof Items;
				const value = calculatedItem[key];

				/** Safety check to ensure we are operating on a number. */
				if (typeof value !== 'number') continue;

				const criteriaKey = key as keyof typeof criteria;

				/** Handle the weight logic based on output mode. */
				let weightingValue = Number(criteria[criteriaKey]);

				if (output === 'normalization') {
					weightingValue = 1;
				}

				/** 3. Perform the SAW Calculation. */
				let finalValue: number;

				if (cob.type === 'cost') {
					/** Cost Formula: (Min / Value) * Weight */
					finalValue = (cob.value / value) * weightingValue;
				} else {
					/** Benefit Formula: (Value / Max) * Weight */
					finalValue = (value / cob.value) * weightingValue;
				}

				/**
				 * 4. Update the specific field in the cloned object.
				 * biome-ignore lint/suspicious/noExplicitAny: the type is programmatically assigning
				 */
				(calculatedItem as any)[key] = finalValue;
			}

			return calculatedItem;
		});
	}

	/**
	 * Sums the calculated criteria values for each item to produce a final rank.
	 *
	 * @param {Object} params - The input parameters.
	 * @param {Set<string>} params.criteriaNames - The list of active criteria to sum.
	 * @param {Items[]} params.items - The items containing weighted scores.
	 *
	 * @returns {ItemWithScore[]} The items sorted by `totalScore` in descending order (highest rank first).
	 */
	public sumTotalScore({
		criteriaNames,
		items,
		sorted = true,
	}: {
		criteriaNames: Set<string>;
		items: Items[];
		sorted?: boolean;
	}): ItemWithScore[] {
		const scoredItems = items.map((item) => {
			let totalScore = 0;

			/**
			 * Optimization: Iterate over the Set of names, not the object keys.
			 * This prevents us from checking non-numeric fields like 'id' or 'created_at'.
			 */
			for (const name of criteriaNames) {
				/** We assert that the criteria name exists on the Item. */
				const key = name as keyof Items;
				const value = item[key];

				/** Strict check to ensure we only add numbers. */
				if (typeof value === 'number') {
					totalScore += value;
				}
			}

			return {
				...item,
				totalScore,
			};
		});

		if (!sorted) {
			return scoredItems;
		}

		/** Sort by totalScore descending (highest score first). */
		return scoredItems.sort((a, b) => b.totalScore - a.totalScore);
	}
}
