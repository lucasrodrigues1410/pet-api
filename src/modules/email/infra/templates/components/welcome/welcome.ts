import { WelcomeTemplateVariables } from "@/modules/email/domain/templates/user-created/template";
import { z } from "zod";
import { render as reactEmailRender } from "@react-email/components";
import { BaseEmailTemplate } from "@/modules/email/domain/templates/base-email.template";
import WelcomeTemplateComponent from "./welcome.component";

export class WelcomeTemplate extends BaseEmailTemplate<WelcomeTemplateVariables> {
	subject = "Seja bem-vindo(a) à nossa plataforma!";
	schema = z.any();

	protected renderComponent() {
		return reactEmailRender(WelcomeTemplateComponent());
	}
}
