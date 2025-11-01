import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';

export const entryPoint = async (_req: Request, res: Response) => {
	const __dirname = import.meta.dirname;
	const messagePath = path.join(__dirname, 'entry-message.txt');
	const message = readFileSync(messagePath, { encoding: 'utf-8' });
	res.send(message);
};
