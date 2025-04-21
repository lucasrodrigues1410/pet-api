import { Injectable } from "@nestjs/common";
import { SenderEmail } from "../../domain/interfaces/notification-sender.interface";
import UserCreatedTemplate from "./react-email/user-created.tempate";

type TemplateComponent = React.FC<any>;
type TemplateName = SenderEmail["data"]["templateName"];

@Injectable()
export class TemplateFactory {
	getTemplate(name: TemplateName): TemplateComponent {
		switch (name) {
			case "WELCOME_USER":
				return UserCreatedTemplate;
			default:
				throw new Error(`Template não encontrado: ${name}`);
		}
	}
}
