import { TextEncoder } from 'node:util';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import * as jose from 'jose';
import z from 'zod';

/**
 * Please use to check the payload or `res.locals.user`.
 */
export const jwtPayload = z.object({
	role: z.enum(['user', 'system_user']),
	sub: z.string(),
	exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayload>;

/**
 * Use this if needed!.
 */
export class ErrorAuthMiddleware extends Error {}

const credentialTypeCheck = (...credentials: unknown[]) => {
	const identities = credentials.filter(
		(identity) => typeof identity === 'string',
	);

	if (identities.length === 0) {
		throw new ErrorAuthMiddleware('Please login!.');
	}

	if (identities.length > 1) {
		throw new ErrorAuthMiddleware('Please use one of credential!.');
	}
};

const httpAuthCheck = async (token: string): Promise<JwtPayload> => {
	const checkType = token.split(' ');

	if (!checkType || checkType[0] !== 'Bearer') {
		throw new Error('Auth type is not supported!.');
	}

	const key = new TextEncoder().encode(process.env.APP_SECRET_ACCESS);
	const currentTime = Date.now();
	const check = await jose.jwtVerify<JwtPayload>(checkType[1] as string, key);

	if (currentTime > check.payload.exp) {
		throw new ErrorAuthMiddleware(
			'Your session is ended, Please login again!.',
		);
	}

	return check.payload;
};

/**
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 *
 * Currently it only support Bearer Token.
 */
export const authMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const apiKey = req.headers['x-api-key'];
	const queryApiKey = req.query['api-key'];
	const httpAuth = req.headers.authorization;

	credentialTypeCheck(apiKey, queryApiKey, httpAuth);

	if (apiKey || queryApiKey) {
		throw new Error('Feature is not implemented!');
	}

	if (httpAuth) {
		const auth = await httpAuthCheck(httpAuth);

		res.locals.user = auth;
	}

	next();
};
