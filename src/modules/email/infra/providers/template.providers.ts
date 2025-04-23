import { Provider } from "@nestjs/common";
import { UserCreatedTemplate } from "../templates/components/user-created/user-created";
import { TemplateFactory } from "../templates/template.factory";

export const TemplateProviders: Provider[] = [
	{
		provide: "TEMPLATE_FACTORY",
		useFactory: () => {
			const factory = new TemplateFactory();
			factory.register("welcome", new UserCreatedTemplate());
			return factory;
		},
	},
];
