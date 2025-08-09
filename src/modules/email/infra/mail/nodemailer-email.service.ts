import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import type {
	IEmailService,
	ISendMailOptions,
} from "../../domain/interfaces/email-service";

@Injectable()
export class NodemailerEmailService implements IEmailService {
	private readonly logger = new Logger(NodemailerEmailService.name);
	constructor(private readonly mailerService: MailerService) {}

	async sendMail(options: ISendMailOptions): Promise<void> {
		this.logger.log(`Sending email to ${options.to}`);
		try {
			await this.mailerService.sendMail({
				from: "Acme <onboarding@resend.dev>",
				to: options.to,
				subject: options.subject,
				html: options.html,
			});
		} catch (error) {
			this.logger.error(`Failed to send email to ${options.to}`, error);
			throw error;
		}
	}
}
