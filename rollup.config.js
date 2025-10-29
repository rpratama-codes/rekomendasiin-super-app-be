import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'esm',
		sourcemap: true,
	},
	plugins: [
		typescript(),
		terser(),
		copy({
			targets: [
				{
					src: [
						'./src/service/misc/entry-message.txt',
						'./src/prisma/schema.prisma',
						'package.json',
						'pnpm-lock.yaml',
					],
					dest: './dist/',
				},
			],
		}),
	],
};
