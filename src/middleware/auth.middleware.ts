import { TextEncoder } from 'node:util';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import * as jose from 'jose';
import { JWSSignatureVerificationFailed } from 'jose/errors';
import z from 'zod';

/**
 * Zod schema validation for the JWT payload.
 * Use this to type-check `res.locals.user` or validate incoming payloads.
 */
export const jwtPayload = z.object({
	role: z.enum(['user', 'system_user']),
	sub: z.string(),
	exp: z.number(),
});

/**
 * Type inference for the JWT payload based on the Zod schema.
 */
export type JwtPayload = z.infer<typeof jwtPayload>;

/**
 * Custom error class for handling Authentication-related exceptions in middleware.
 */
export class ErrorAuthMiddleware extends Error {}

/**
 * Validates that exactly one credential type is provided.
 * Throws an error if no credentials are found or if multiple types are provided simultaneously.
 * * @param credentials - A list of potential credential values (e.g., API key, Bearer token).
 * @throws {ErrorAuthMiddleware} If 0 or >1 credentials are provided.
 */
const credentialTypeCheck = (...credentials: unknown[]) => {
	const identities = credentials.filter(
		(identity) => typeof identity === 'string',
	);

	if (identities.length === 0) {
		throw new ErrorAuthMiddleware('Please login.');
	}

	if (identities.length > 1) {
		throw new ErrorAuthMiddleware('Please use only one type of credential.');
	}
};

/**
 * Verifies and decodes a JWT Bearer token.
 * Checks structure, signature, and expiration.
 * * @param token - The raw Authorization string (e.g., "Bearer eyJ...").
 * @param type - The type of token to verify ('access' or 'refresh'). Defaults to 'access'.
 * @returns A promise resolving to the decoded user payload and the raw token.
 * @throws {ErrorAuthMiddleware} If the token is invalid, malformed, or expired.
 */
const httpAuthCheck = async (
	token: string,
	type: 'access' | 'refresh' = 'access',
): Promise<{ user: JwtPayload; token: string }> => {
	const checkType = token.split(' ');

	if (checkType.length < 2) {
		// checks for empty token to provide clearer errors for API clients (Bruno/Postman)
		throw new ErrorAuthMiddleware('No empty token allowed.');
	}

	if (!checkType || checkType[0] !== 'Bearer') {
		throw new ErrorAuthMiddleware('Auth type is not supported.');
	}

	const bearerToken = checkType[1] as string;
	const secret =
		type === 'access'
			? process.env.APP_SECRET_ACCESS
			: process.env.APP_SECRET_REFRESH;
	const key = new TextEncoder().encode(secret);

	// JWT uses seconds, not milliseconds
	const currentTime = Math.floor(Date.now() / 1000);
	let check: jose.JWTVerifyResult<JwtPayload>;

	try {
		check = await jose.jwtVerify<JwtPayload>(bearerToken, key);
	} catch (error: unknown) {
		if (error instanceof JWSSignatureVerificationFailed) {
			throw new ErrorAuthMiddleware('Wrong token signature.');
		}

		throw error;
	}

	if (currentTime > check.payload.exp) {
		throw new ErrorAuthMiddleware(
			'Your session has ended, please login again.',
		);
	}

	return { user: check.payload, token: bearerToken };
};

/**
 * Express Middleware for Access Token Authentication.
 * * Checks for `x-api-key`, `api-key` query param, or `Authorization` header.
 * Currently, only Bearer Token authentication is fully implemented.
 * * Successful authentication populates `res.locals.user`.
 * * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
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
		throw new ErrorAuthMiddleware('Feature is not implemented.');
	}

	if (httpAuth) {
		const auth = await httpAuthCheck(httpAuth);
		res.locals.user = auth.user;
	}

	next();
};

/**
 * Express Middleware specific to Refresh Tokens.
 * * Validates the `Authorization` header against the refresh token secret.
 * Successful validation populates `res.locals.user`.
 * * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
export const refreshMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const httpAuth = req.headers.authorization;

	if (!httpAuth) {
		throw new ErrorAuthMiddleware('Unauthorized.');
	}

	const auth = await httpAuthCheck(httpAuth, 'refresh');
	res.locals.user = auth.user;
	next();
};
