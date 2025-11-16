import path from "node:path";
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
	schema: path.join("src/services/prisma", "schema.prisma"),
	migrations: {
		path: path.join("src/services/prisma", "migrations"),
		seed: "tsx src/services/prisma/seeds/00_seed_all.ts",
	},
	views: {
		path: path.join("src/services/prisma", "views"),
	},
	typedSql: {
		path: path.join("src/services/prisma", "queries"),
	},
	engine: "classic",
	datasource: {
		url: env("DATABASE_URL"),
	},
});
