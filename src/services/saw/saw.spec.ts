import { describe, expect, it } from 'vitest';
import type { Criterias } from '../prisma/generated/client.js';
import { testCriterias, testItems } from './saw.mock.js';
import {
	type CriteriaWithOmittedKey,
	SimpleAdditiveWeighting,
} from './saw.service.js';

describe('Testing for simpple additive weighting', () => {
	const sawService = new SimpleAdditiveWeighting();
	const criteriaNames = sawService.criteriaPicker(
		testCriterias[0] as CriteriaWithOmittedKey,
	);

	const { costAndBenefit, filteredItems } =
		sawService.determinatingCostAndBenefit({ criteriaNames, items: testItems });

	const normalizationGaming = sawService.normalizationOrWeighting({
		costAndBenefit,
		filteredItems,
		criteria: testCriterias.find(
			(c) => c.criteria_name === 'gaming',
		) as Criterias,
		output: 'normalization',
	});

	const weightingGaming = sawService.normalizationOrWeighting({
		costAndBenefit,
		filteredItems,
		criteria: testCriterias.find(
			(c) => c.criteria_name === 'gaming',
		) as Criterias,
		output: 'weighting',
	});

	const summaryGaming = sawService.sumTotalScore({
		criteriaNames,
		items: weightingGaming,
		sorted: false,
	});

	const property = [
		'id',
		'criteria_name',
		'category_id',
		'created_at',
		'updated_at',
	];

	it.each(Array.from(criteriaNames))(
		`Should not contain ${property}`,
		(name) => {
			property.forEach((val) => {
				expect(name).not.contain(val);
			});
		},
	);

	it('Should loging on console for manual test.', () => {
		/**
		 * Cost and benefit
		 */
		console.table(costAndBenefit);

		/**
		 * Test Items
		 */
		console.table(
			testItems.map(({ item_name, price, soc, ram, rom, camera, battery }) => {
				return { item_name, price, soc, ram, rom, camera, battery };
			}),
		);

		/**
		 * Normalization For Gaming
		 */
		console.table(
			normalizationGaming.map(
				({ item_name, price, soc, ram, rom, camera, battery }) => {
					return { item_name, price, soc, ram, rom, camera, battery };
				},
			),
		);

		/**
		 * Normalization For Gaming
		 */
		console.table(
			weightingGaming.map(
				({ item_name, price, soc, ram, rom, camera, battery }) => {
					return { item_name, price, soc, ram, rom, camera, battery };
				},
			),
		);

		/**
		 * Summary For Gaming
		 */
		console.table(
			summaryGaming.map(
				({ item_name, price, soc, ram, rom, camera, battery, totalScore }) => {
					return {
						item_name,
						price,
						soc,
						ram,
						rom,
						camera,
						battery,
						totalScore,
					};
				},
			),
		);
	});
});
