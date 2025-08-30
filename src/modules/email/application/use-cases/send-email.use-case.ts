import { Inject, Injectable } from "@nestjs/common";
import type {
	IEmailService,
	ISendMailOptions,
} from "../../domain/interfaces/email-service";
import type { ITemplateFactory } from "../../domain/interfaces/template-factory";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

interface SendEmailUseCaseInput<
	K extends keyof TemplateVariablesMap = keyof TemplateVariablesMap,
> {
	templateKey: K;
	target: string;
	variables: TemplateVariablesMap[K];
}

@Injectable()
export class SendEmailUseCase {
	constructor(
		@Inject("TEMPLATE_FACTORY")
		private readonly templateFactory: ITemplateFactory,

		@Inject("IEmailService")
		private readonly emailService: IEmailService,
	) {}

	async execute<K extends keyof TemplateVariablesMap>(
		params: SendEmailUseCaseInput<K>,
	): Promise<void> {
		const template = this.templateFactory.get(params.templateKey);
		const html = await template.render(params.variables);

		const mailOptions: ISendMailOptions = {
			to: params.target,
			subject: template.subject,
			html,
		};

		await this.emailService.sendMail(mailOptions);
	}

	// Método auxiliar para verificar templates disponíveis
	getAvailableTemplates(): (keyof TemplateVariablesMap)[] {
		return this.templateFactory.getAvailableTemplates();
	}
}
