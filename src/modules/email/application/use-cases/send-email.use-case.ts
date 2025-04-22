import { Injectable, Inject } from "@nestjs/common";
import { TemplateVariablesMap } from "../../domain/template-variables";
import type { ITemplateRenderer } from "../../domain/interfaces/i-template-render.interface";
import type { IEmailService, ISendMailOptions } from "../../domain/interfaces/i-email-service";

@Injectable()
export class SendEmailUseCase {
	constructor(
		@Inject("ITemplateRenderer")
		private readonly renderer: ITemplateRenderer,

		@Inject("IEmailService")
		private readonly emailService: IEmailService,
	) {}

	async execute(
		templateKey: string,
		to: string,
		variables: Record<string, any>,
	): Promise<void> {
		const { subject, html } = await this.renderer.render(
			templateKey as keyof TemplateVariablesMap,
			variables as TemplateVariablesMap[keyof TemplateVariablesMap],
		);

		const mailOptions: ISendMailOptions = { to, subject, html };
		await this.emailService.sendMail(mailOptions);
	}
}
