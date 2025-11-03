import { z } from 'zod';

export const storeFrontDto = z.object({
	basePrice: z
		.object({
			min: z
				.number()
				.nonnegative({ message: 'Minimum price cannot be negative' }),
			max: z
				.number()
				.nonnegative({ message: 'Maximum price cannot be negative' }),
		})
		.refine((data) => data.max >= data.min, {
			message: 'Maximum price must be greater than or equal to minimum price',
			path: ['max'],
		}),
	criteria_id: z.string().min(1, { message: 'Criteria ID is required' }),
});

export type StoreFrontDto = z.infer<typeof storeFrontDto>;
