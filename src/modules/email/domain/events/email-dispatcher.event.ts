import { NotificationEvent } from "@/modules/notification/domain/events/notification.event";
import { TemplateVariablesMap } from "../templates/template-variables-map";

export class EmailDispatchEvent<
	T extends keyof TemplateVariablesMap = keyof TemplateVariablesMap,
> extends NotificationEvent {
	constructor(
		public readonly templateKey: T,
		public readonly target: string,
		public readonly variables: TemplateVariablesMap[T],
	) {
		super("email", templateKey, target, variables);
	}
}
