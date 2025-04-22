import { TemplateVariablesMap } from "../../domain/template-variables";
import UserCreatedTemplate from "./components/user-created.tempate";

export const templatesRegistration = {
	welcome: {
		component: UserCreatedTemplate,
		subject: "Bem-vindo ao nosso App!",
	},
} satisfies Record<
	keyof TemplateVariablesMap,
	{ component: any; subject: string }
>;
