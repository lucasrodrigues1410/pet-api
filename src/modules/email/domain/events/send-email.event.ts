import { TemplateVariablesMap } from "../templates/template-variables-map";

export class SendEmailEvent<
	K extends keyof TemplateVariablesMap = keyof TemplateVariablesMap,
> {
	constructor(
		public readonly templateKey: K,
		public readonly target: string,
		public readonly variables: TemplateVariablesMap[K],
		public readonly priority: "low" | "normal" | "high" = "normal",
		public readonly delay?: number, // delay in milliseconds
	) {}

	static create<K extends keyof TemplateVariablesMap>(
		templateKey: K,
		target: string,
		variables: TemplateVariablesMap[K],
		options?: { priority?: "low" | "normal" | "high"; delay?: number },
	): SendEmailEvent<K> {
		return new SendEmailEvent(
			templateKey,
			target,
			variables,
			options?.priority,
			options?.delay,
		);
	}
}
