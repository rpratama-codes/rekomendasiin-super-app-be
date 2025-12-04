import type {
	JwtPayload,
	SystemRoles,
} from './src/middleware/auth.middleware.ts';

declare global {
	namespace Express {
		interface Locals {
			user?: JwtPayload;
			requiredRole?: SystemRoles[];
		}
	}
}
