import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	ssr: {
		/**
		 * Still find out to include prisma and argon2 into bundle.
		 */
		noExternal: true,
		external: ["@prisma/client", "@prisma/adapter-pg", "argon2"],
	},
	build: {
		outDir: "./dist",
		ssr: "./src/index.ts",
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "package.json",
					dest: "",
				},
				{
					src: "pnpm-lock.yaml",
					dest: "",
				},
				{
					src: "src/services/prisma/schema.prisma",
					dest: "",
				},
			],
		}),
	],
	resolve: {},
});
