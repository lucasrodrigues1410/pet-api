import { render as reactEmailRender } from "@react-email/components";
import { z } from "zod";
import { BaseEmailTemplate } from "@/modules/email/domain/templates/base-email.template";
import { EmployeeInviteTemplateVariables } from "@/modules/email/domain/templates/employee-invite.template";
import EmployeeInviteComponent from "./employee-invite.component";

export class EmployeeInviteTemplate extends BaseEmailTemplate<EmployeeInviteTemplateVariables> {
	subject = "Convite para ser funcionário - PetSpot";
	
	protected schema = z.object({
		employeeName: z.string().min(1, "Nome do funcionário é obrigatório"),
		companyName: z.string().min(1, "Nome da empresa é obrigatório"),
		inviterName: z.string().min(1, "Nome do convidador é obrigatório"),
		token: z.string().min(1, "Token é obrigatório"),
		expiresAt: z.date(),
		acceptInviteUrl: z.url("URL deve ser válida"),
	});

	protected renderComponent(variables: EmployeeInviteTemplateVariables) {
		return reactEmailRender(EmployeeInviteComponent(variables));
	}
}
