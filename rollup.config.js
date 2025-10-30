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
		nodeResolve({ preferBuiltins: true }),
		terser(),
		copy({
			targets: [
				{
					src: [
						/**
						 * file bellow just a testing file.
						 */
						'./src/service/misc/entry-message.txt',
						/**
						 * It not nessesary to put files below,
						 * But we leave it as is in case we want to do something else in the future.
						 */
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
