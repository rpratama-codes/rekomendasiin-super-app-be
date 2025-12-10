import z from 'zod';

export const signUpDto = z.object({
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	email: z
		.email()
		.nonempty()
		.transform((email) => email.toLowerCase()),
	password: z.string().min(8, 'Password must has minimum 8 character!'),
});

export type SignUpDto = z.infer<typeof signUpDto>;

export const signInDto = z.object({
	email: z
		.email()
		.nonempty()
		.transform((email) => email.toLowerCase()),
	password: z.string().min(8, 'Password must has minimum 8 character!'),
});

export type SignInDto = z.infer<typeof signInDto>;

export const verifyOtpDto = z.object({
	email: z.email(),
	token: z.string(),
});

export type VerifyPayloadDto = z.infer<typeof verifyOtpDto>;

export const refreshTokenDto = z.object({
	token: z.string(),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenDto>;

export const verifyGoogleLoginDto = z.object({
	idToken: z.string(),
});

export type VerifyGoogleLoginDto = z.infer<typeof verifyGoogleLoginDto>;
