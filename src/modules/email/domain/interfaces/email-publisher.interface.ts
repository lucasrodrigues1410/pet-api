import { SendEmailEvent } from "../events/send-email.event";
import { TemplateVariablesMap } from "../templates/template-variables-map";

export abstract class EmailPublisher {
	abstract dispatch<K extends keyof TemplateVariablesMap>(
		event: SendEmailEvent<K>
	): Promise<void>;
}
