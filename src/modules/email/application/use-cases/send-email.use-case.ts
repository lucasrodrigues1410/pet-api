import { Inject, Injectable } from "@nestjs/common";
import type {
	IEmailService,
	ISendMailOptions,
} from "../../domain/interfaces/email-service";
import type { ITemplateFactory } from "../../domain/interfaces/template-factory";

interface SendEmailUseCaseInput {
	templateKey: string;
	target: string;
	variables: Record<string, unknown>;
}

@Injectable()
export class SendEmailUseCase {
	constructor(
		@Inject("TEMPLATE_FACTORY")
		private readonly templateFactory: ITemplateFactory,

		@Inject("IEmailService")
		private readonly emailService: IEmailService,
	) {}

	async execute(params: SendEmailUseCaseInput): Promise<void> {
		const template = this.templateFactory.get(params.templateKey);
		const html = await template.render(params.variables);

		const mailOptions: ISendMailOptions = {
			to: params.target,
			subject: template.subject,
			html,
		};
		await this.emailService.sendMail(mailOptions);
	}
}
