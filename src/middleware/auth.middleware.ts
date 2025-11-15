import { TextEncoder } from 'node:util';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import * as jose from 'jose';
import { JWSSignatureVerificationFailed } from 'jose/errors';
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

const httpAuthCheck = async (
	token: string,
	type: 'access' | 'refresh' = 'access',
): Promise<{ user: JwtPayload; token: string }> => {
	const checkType = token.split(' ');

	if (checkType.length < 2) {
		/**
		 * To provide error for api client like bruno or postman if not provide a token.
		 */
		throw new ErrorAuthMiddleware('No empty token allowed!.');
	}

	if (!checkType || checkType[0] !== 'Bearer') {
		throw new ErrorAuthMiddleware('Auth type is not supported!.');
	}

	const bearerToken = checkType[1] as string;
	const secret =
		type === 'access'
			? process.env.APP_SECRET_ACCESS
			: process.env.APP_SECRET_REFRESH;
	const key = new TextEncoder().encode(secret);
	const currentTime = Date.now();
	let check: jose.JWTVerifyResult<JwtPayload>;

	try {
		check = await jose.jwtVerify<JwtPayload>(bearerToken, key);
	} catch (error: unknown) {
		if (error instanceof JWSSignatureVerificationFailed) {
			throw new ErrorAuthMiddleware('Wrong type token!');
		}

		throw error;
	}

	if (currentTime > check.payload.exp) {
		throw new ErrorAuthMiddleware(
			'Your session is ended, Please login again!.',
		);
	}

	return { user: check.payload, token: bearerToken };
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
		throw new ErrorAuthMiddleware('Feature is not implemented!');
	}

	if (httpAuth) {
		const auth = await httpAuthCheck(httpAuth);
		res.locals.user = auth.user;
	}

	next();
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * 
 * Only for refresh token!.
 */
export const refreshMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const httpAuth = req.headers.authorization;

	if (!httpAuth) {
		throw new ErrorAuthMiddleware('Unauthorize!.');
	}

	const auth = await httpAuthCheck(httpAuth, 'refresh');
	res.locals.user = auth.user;
	res.locals.token = auth.token;
	next();
};
