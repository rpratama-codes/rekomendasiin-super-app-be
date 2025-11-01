import { assert, describe, it } from 'vitest';
import { DecisionSupportSystems } from '../suggesion/dss.service.ts';
import { testItems } from './dss.mock.ts';

describe('DSS Test', () => {
	const dss = new DecisionSupportSystems();

	/**
	 * Just trying test, latter i write comperhensive test!
	 * TODO: Create Test!
	 */

	it('should return an array', async () => {
		assert.isArray(
			dss.simpleAdditiveWeighting({
				criteria: {
					price: 0.5,
					soc: 0.2,
					ram: 0.125,
					rom: 0.05,
					camera: 0.025,
					battery: 0.1,
					network: 0,
					nfc: 0,
					screen: 0,
					weight: 0,
				},
				items: testItems,
			}),
		);
	});
});
