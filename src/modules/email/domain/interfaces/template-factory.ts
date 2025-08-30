import { TemplateVariablesMap } from "../templates/template-variables-map";
import { EmailTemplate } from "./email-template";

export interface ITemplateFactory {
	get<K extends keyof TemplateVariablesMap>(
		key: K,
	): EmailTemplate<TemplateVariablesMap[K]>;

	register<K extends keyof TemplateVariablesMap>(
		key: K,
		template: EmailTemplate<TemplateVariablesMap[K]>,
	): void;

	getAvailableTemplates(): (keyof TemplateVariablesMap)[];
	hasTemplate(templateName: keyof TemplateVariablesMap): boolean;
}
