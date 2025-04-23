import type { ITemplateFactory } from "../../domain/interfaces/template-factory";
import { EmailTemplate } from "../../domain/templates/email-template";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

export class TemplateFactory implements ITemplateFactory {
	private templates = new Map<string, EmailTemplate<any>>();

	register<T extends Record<string, unknown>>(
		templateName: keyof TemplateVariablesMap,
		template: EmailTemplate<T>,
	): void {
		this.templates.set(templateName, template);
	}

	get<T extends Record<string, unknown>>(
		templateName: string,
	): EmailTemplate<T> {
		const template = this.templates.get(templateName);
		if (!template) {
			throw new Error(`Template ${templateName} not found`);
		}
		return template as EmailTemplate<T>;
	}
}
