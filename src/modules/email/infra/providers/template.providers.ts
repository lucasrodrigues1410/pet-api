import { Provider } from "@nestjs/common";
import { EmailTemplate } from "../../domain/interfaces/email-template";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";
import { AppointmentChangeStatusTemplate } from "../templates/components/appointment-change-status/change-status";
import { WelcomeTemplate } from "../templates/components/welcome/welcome";
import { TemplateFactory } from "../templates/template.factory";

// Registry de templates para facilitar manutenção e evitar duplicação
const TEMPLATE_REGISTRY: {
	[K in keyof TemplateVariablesMap]: () => EmailTemplate<
		TemplateVariablesMap[K]
	>;
} = {
	welcome: () => new WelcomeTemplate(),
	"appointment-status-changed": () => new AppointmentChangeStatusTemplate(),
} as const;

export const TemplateProviders: Provider[] = [
	{
		provide: "TEMPLATE_FACTORY",
		useFactory: () => {
			const factory = new TemplateFactory();

			// Registro automático de todos os templates
			(
				Object.keys(TEMPLATE_REGISTRY) as (keyof TemplateVariablesMap)[]
			).forEach((key) => {
				const templateInstance = TEMPLATE_REGISTRY[key]();
				factory.register(key, templateInstance);
			});

			return factory;
		},
	},
];
