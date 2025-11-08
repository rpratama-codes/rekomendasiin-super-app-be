import { createTransport, type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

export class MailService {
	private transporter: Transporter<
		SMTPTransport.SentMessageInfo,
		SMTPTransport.Options
	>;

	constructor() {
		this.transporter = createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			tls:
				process.env.NODE_ENV === 'development'
					? undefined
					: {
							rejectUnauthorized: true,
							minVersion: 'TLSv1.2',
						},
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	public async send({
		to,
		subject,
		html,
		text,
	}: {
		to: string;
		subject: string;
		html?: string;
		text?: string;
	}) {
		return await this.transporter.sendMail({
			from: `"Rekomendasiin App" <${process.env.SMTP_EMAIL}>`,
			to,
			subject,
			html,
			text,
		});
	}
}
