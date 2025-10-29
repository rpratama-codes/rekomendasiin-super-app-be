import { expect, test } from 'vitest';
import { addition } from './service/misc/entry-point.ts';

test('adds 1 + 2 to equal 3', () => {
	expect(addition(1, 2)).toBe(3);
});
