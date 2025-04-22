import { NotificationChannel } from "../enums/notification-channel.enum";
import { TemplateVariablesMap } from "../../../email/domain/template-variables";

export class NotificationEvent {
	constructor(
		public readonly provider: NotificationChannel,
		public readonly templateKey: keyof TemplateVariablesMap,
		public readonly target: string,
		public readonly variables: Record<string, any>,
	) {}
}
