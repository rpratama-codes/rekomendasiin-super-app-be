import z from 'zod';

export const createUserDto = z.object({
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	email: z.email().nonempty(),
	password: z.string().min(8, 'Password must has minimum 8 character!'),
});

export type CreateUserDto = z.infer<typeof createUserDto>;

export const jwtPayload = z.object({
	role: z.enum(['user', 'system_user']),
	sub: z.string(),
	exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayload>;
