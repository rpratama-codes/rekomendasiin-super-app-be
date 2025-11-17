import '@dotenvx/dotenvx/config';
import { seedUser } from './01_user.js';
import { seedCategoriesCriteriasItems } from './02_category_item_criteria.js';

await seedUser();
await seedCategoriesCriteriasItems();
