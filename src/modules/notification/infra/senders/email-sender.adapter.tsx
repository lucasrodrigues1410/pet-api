import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { render } from "@react-email/components";
import {
	NotificationSender,
	SenderEmail,
} from "../../domain/interfaces/notification-sender.interface";
import { TemplateFactory } from "../templates/template.factory";

@Injectable()
export class EmailAdapter implements NotificationSender {
	constructor(
		private readonly mailerService: MailerService,
		private readonly templateFactory: TemplateFactory,
	) {}

	async send(params: SenderEmail): Promise<void> {
		const { data } = params;
		const TemplateComponent = this.templateFactory.getTemplate(
			data.templateName,
		);
		const html = await render(<TemplateComponent {...data.variables} />);
		await this.mailerService.sendMail({
			from: "Acme <onboarding@resend.dev>",
			to: data.to,
			subject: data.subject,
			html,
		});
	}
}
