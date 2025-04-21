import { Injectable } from "@nestjs/common";
import UserCreatedTemplate from "./email/user-created.tempate";
import { EmailTemplates } from "../../domain/models/notification-template.types";
import { JSX } from "react";

type TemplateComponent<T extends keyof EmailTemplates> = (
	variables: EmailTemplates[T],
) => string | JSX.Element;

type TemplateRegistry = {
	[K in keyof EmailTemplates]: TemplateComponent<K>;
};

const templateComponents: TemplateRegistry = {
	WELCOME_USER: ({ userName }) => {
		return UserCreatedTemplate({ userName });
	},
};

@Injectable()
export class TemplateFactory {
	getTemplate<T extends keyof EmailTemplates>(name: T): TemplateComponent<T> {
		const template = templateComponents[name];

		if (!template) {
			throw new Error(`Template não encontrado: ${String(name)}`);
		}

		return template;
	}
}
