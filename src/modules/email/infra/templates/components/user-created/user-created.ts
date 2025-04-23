import { EmailTemplate } from "@/modules/email/domain/templates/email-template";
import { UserCreatedTemplateVariables } from "@/modules/email/domain/templates/user-created/template";
import { renderToStaticMarkup } from "react-dom/server";
import { z } from "zod";
import UserCreatedTemplateComponent from "./user-created.component";
import { InvalidTemplateVariablesError } from "@/modules/email/domain/errors/invalid-template-variables.errors";

export class UserCreatedTemplate
	implements EmailTemplate<UserCreatedTemplateVariables>
{
	readonly subject = "Seja bem-vindo(a) à nossa plataforma!";
	private readonly schema = z.object({ name: z.string() });

	render(variables: UserCreatedTemplateVariables) {
		const result = this.schema.safeParse(variables);
		if (!result.success) {
			throw new InvalidTemplateVariablesError(
				result.error.errors.map((error) => error.path.join(".")),
			);
		}
		return renderToStaticMarkup(
			UserCreatedTemplateComponent({
				userName: result.data.name,
			}),
		);
	}
}
