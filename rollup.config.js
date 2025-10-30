/** biome-ignore-all assist/source/organizeImports: <this is a config file so doesn't need to be lint> */

import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
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
		commonjs(),
		json(),
		nodeResolve({preferBuiltins: true}),
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
