import { ServiceBase } from '../../utils/base-class/service.class.js';
import type {
	Categories,
	Criterias,
	Items,
} from '../prisma/generated/client.js';

export class StoreFrontService extends ServiceBase {
	public async listCategory(): Promise<Categories[]> {
		const category = await this.prisma.categories.findMany();

		return category;
	}

	public async listCriteriaClient(): Promise<
		Pick<Criterias, 'id' | 'criteria_name'>[]
	> {
		const criteria = await this.prisma.criterias.findMany({
			select: {
				id: true,
				criteria_name: true,
			},
		});

		return criteria;
	}

	public async CriteriaAndItemsForRecomendation({
		basePrice,
		criteria_id,
	}: {
		basePrice: {
			min: number;
			max: number;
		};
		criteria_id: string;
	}): Promise<{
		items: Items[];
		criteria: Criterias | null;
	}> {
		const [items, criteria] = await Promise.all([
			this.prisma.items.findMany({
				where: {
					price: {
						gte: basePrice.min,
						lte: basePrice.max,
					},
				},
				orderBy: {
					price: 'desc',
				},
			}),
			this.prisma.criterias.findFirst({
				where: {
					id: criteria_id,
				},
			}),
		]);

		return {
			items,
			criteria,
		};
	}
}
