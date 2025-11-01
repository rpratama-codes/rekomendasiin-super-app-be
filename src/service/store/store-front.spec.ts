import { assert, describe, expect, it } from 'vitest';
import { logger } from '../../utils/logger/winston.ts';
import { DecisionSupportSystems } from '../suggesion/dss.service.ts';
import { StoreFront } from './store-front.service.ts';

describe('Store front test', () => {
	/**
	 * Just trying test, latter i write comperhensive test!
	 * TODO: Create Test!
	 */

	const storeFront = new StoreFront({
		logger,
		dss: new DecisionSupportSystems(),
	});

	it('should thorw an error', async () => {
		await expect(
			storeFront.listRecomendation({
				basePrice: { max: 4_000_000, min: 2_000_000 },
				criteria_id: 'a',
			}),
		).rejects.toThrowError();
	});

	it('It should return an array', async () => {
		assert.isArray(
			await storeFront.listRecomendation({
				basePrice: { max: 4_000_000, min: 2_000_000 },
				criteria_id: '019a386c-7104-7ceb-bf2d-d68fb168c9da',
			}),
		);
	});
});
