import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	ssr: {
		/**
		 * Still find out to include prisma and argon2 into bundle.
		 */
		noExternal: true,
		external: ["pg", "argon2"],
	},
	build: {
		// I think i shoud use feature below in the future.
		minify: true,
		// sourcemap: true,
		outDir: "./dist",
		ssr: "./src/index.ts",
	},
	plugins: [
		viteStaticCopy({
			// Ignore missing file
			silent: true,
			targets: [
				{
					src: "package.json",
					dest: "./",
					transform: {
						handler: (file, name) => {
							/**
							 * TODO : Create Transform function to include external dependency only!
							 */

							return file;
						},
					},
				},
				{
					src: "pnpm-lock.yaml",
					dest: "./",
				},
				{
					src: "src/services/prisma/schema.prisma",
					dest: "./",
				},
				{
					src: "ca.pem",
					dest: "",
				},
				{
					src: ".env",
					dest: "./",
				},
			],
		}),
	],
	resolve: {},
});
