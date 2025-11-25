import { describe, expect, it } from 'vitest';

import { StoreFrontService } from './store-front.service.js';
import '@dotenvx/dotenvx/config';

describe('Store front test', () => {
	const storeFront = new StoreFrontService();

	it('Store front service should be defined', async () => {
		expect(storeFront).toBeDefined();
	});
});
