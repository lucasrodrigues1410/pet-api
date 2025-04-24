import { ZodSchema } from "zod";
import { InvalidTemplateVariablesError } from "../errors/invalid-template-variables.errors";
import { EmailTemplate } from "../interfaces/email-template";

export abstract class BaseEmailTemplate<
	TVariables extends Record<string, unknown>,
> implements EmailTemplate<TVariables>
{
	abstract readonly subject: string;
	protected abstract readonly schema: ZodSchema<TVariables>;

	protected abstract renderComponent(
		variables: TVariables,
	): string | Promise<string>;

	render(variables: TVariables): string | Promise<string> {
		const parsed = this.schema.safeParse(variables);
		if (!parsed.success) {
			const paths = parsed.error.errors.map((e) => e.path.join("."));
			throw new InvalidTemplateVariablesError(paths);
		}

		const html = this.renderComponent(parsed.data);
		return html;
	}
}
