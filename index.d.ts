import type { JwtPayload } from './src/middleware/auth.middleware.ts'

declare global {
	namespace Express {
		interface Locals {
			user?: JwtPayload;
			token?: string;
		}
	}
}