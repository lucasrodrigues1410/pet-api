import { EmailTemplate } from "../../domain/interfaces/email-template";
import type { ITemplateFactory } from "../../domain/interfaces/template-factory";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

export class TemplateFactory implements ITemplateFactory {
	private templates = new Map<keyof TemplateVariablesMap, EmailTemplate<any>>();

	register<K extends keyof TemplateVariablesMap>(
		templateName: K,
		template: EmailTemplate<TemplateVariablesMap[K]>,
	): void {
		this.templates.set(templateName, template);
	}

	get<K extends keyof TemplateVariablesMap>(
		templateName: K,
	): EmailTemplate<TemplateVariablesMap[K]> {
		const template = this.templates.get(templateName);
		if (!template) {
			throw new Error(`Template ${templateName} not found`);
		}
		return template as EmailTemplate<TemplateVariablesMap[K]>;
	}

	// Método auxiliar para obter todas as chaves disponíveis
	getAvailableTemplates(): (keyof TemplateVariablesMap)[] {
		return Array.from(this.templates.keys());
	}

	// Método para verificar se um template existe
	hasTemplate(templateName: keyof TemplateVariablesMap): boolean {
		return this.templates.has(templateName);
	}
}
