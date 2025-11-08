import { defineConfig } from "vite";

export default defineConfig({
	ssr: {
		/**
		 * Still find out to include prisma and argon2 into bundle.
		 */
		noExternal: true,
		external: ["@prisma/client", "argon2"],
	},
	build: {
		outDir: "./dist",
		ssr: "./src/index.ts",
	},
	plugins: [],
	resolve: {},
});
