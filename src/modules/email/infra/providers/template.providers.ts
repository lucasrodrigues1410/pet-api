import { Provider } from "@nestjs/common";
import { WelcomeTemplate } from "../templates/components/welcome/welcome";
import { TemplateFactory } from "../templates/template.factory";

export const TemplateProviders: Provider[] = [
	{
		provide: "TEMPLATE_FACTORY",
		useFactory: () => {
			const factory = new TemplateFactory();
			factory.register("welcome", new WelcomeTemplate());
			return factory;
		},
	},
];
