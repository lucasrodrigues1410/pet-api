import { UserCreatedTemplateVariables } from "@/modules/email/domain/templates/user-created/template";
import { z } from "zod";
import UserCreatedTemplateComponent from "./user-created.component";
import { render as reactEmailRender } from "@react-email/components";
import { BaseEmailTemplate } from "@/modules/email/domain/templates/base-email.template";

export class UserCreatedTemplate extends BaseEmailTemplate<UserCreatedTemplateVariables> {
	subject = "Seja bem-vindo(a) à nossa plataforma!";
	schema = z.object({ name: z.string() });

	protected renderComponent(variables: UserCreatedTemplateVariables) {
		return reactEmailRender(
			UserCreatedTemplateComponent({
				userName: variables.name,
			}),
		);
	}
}
