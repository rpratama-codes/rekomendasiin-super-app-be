import { describe, expect, it } from 'vitest';

import { DecisionSupportSystems } from '../suggesion/dss.service.js';
import { StoreFrontService } from './store-front.service.js';
import '@dotenvx/dotenvx/config';

describe('Store front test', () => {
	/**
	 * Just trying test, latter i write comperhensive test!
	 * TODO: Create Test!
	 */

	const storeFront = new StoreFrontService({
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
});
