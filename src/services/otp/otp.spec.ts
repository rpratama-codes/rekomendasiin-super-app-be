import { assert, describe, expect, it } from 'vitest';
import { type ConfigOTP, OtpService } from './otp.service.js';
import 'dotenv/config';
import z from 'zod';

const otpSchema = z.object({
	token: z.string(),
	secret: z.string(),
	config: z.object({
		algorithm: z.string(),
		digits: z.number(),
		period: z.number(),
	}),
	expired_at: z.date(),
});

type OTP = z.infer<typeof otpSchema>;

describe('OTP Functionality', () => {
	const otpService = new OtpService();

	it('It should be defined', () => {
		expect(otpService).toBeDefined();
	});

	let otp: OTP | undefined;
	let otp2: OTP | undefined;

	it('Generating OTP', async () => {
		otp = await otpService.generateTOTP();
		expect(() => otpSchema.parse(otp)).not.throw();
	});

	it('Generating OTP2', async () => {
		otp2 = await otpService.generateTOTP({
			previousSecret: otp?.secret as string,
		});
		expect(() => otpSchema.parse(otp2)).not.throw();
	});

	it('OTP verification should be failed', () => {
		const verify = otpService.verifyTOTP(
			'123456',
			otp?.secret as string,
			otp?.config as ConfigOTP,
		);

		expect(verify).toBeNull();
	});

	it('OTP verification should be success', () => {
		const verify = otpService.verifyTOTP(
			otp?.token as string,
			otp?.secret as string,
			otp?.config as ConfigOTP,
		);

		assert.isNotNull(verify);
	});

	it('OTP2 verification should be failed', () => {
		const verify = otpService.verifyTOTP(
			'123456',
			otp2?.secret as string,
			otp2?.config as ConfigOTP,
		);

		assert.isNull(verify);
	});

	it('OTP2 verification should be success', () => {
		const verify = otpService.verifyTOTP(
			otp2?.token as string,
			otp2?.secret as string,
			otp2?.config as ConfigOTP,
		);

		assert.isNotNull(verify);
	});
});
