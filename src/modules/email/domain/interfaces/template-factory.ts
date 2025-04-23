import { EmailTemplate } from "../templates/email-template";

export interface ITemplateFactory {
	get(key: string): EmailTemplate<Record<string, unknown>>;
	register(key: string, template: EmailTemplate<Record<string, unknown>>): void;
}
