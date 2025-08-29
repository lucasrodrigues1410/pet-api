import { render as reactEmailRender } from "@react-email/components";
import { z } from "zod";
import { appointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentStatusChangedTemplateVariables } from "@/modules/email/domain/templates/appointment-change-status.template";
import { BaseEmailTemplate } from "@/modules/email/domain/templates/base-email.template";
import ChangeStatusTemplateComponent from "./change-status.component";

export class AppointmentChangeStatusTemplate extends BaseEmailTemplate<AppointmentStatusChangedTemplateVariables> {
	subject = "Seu agendamento foi alterado!";
	schema = z.object({
		userName: z.string(),
		petName: z.string(),
		serviceName: z.string(),
		status: z.enum(appointmentStatus),
		appointmentDate: z.string(),
		appointmentTime: z.string(),
		providerName: z.string(),
	});

	protected renderComponent(
		variables: AppointmentStatusChangedTemplateVariables,
	) {
		return reactEmailRender(
			ChangeStatusTemplateComponent({
				userName: variables.userName,
				petName: variables.petName,
				serviceName: variables.serviceName,
				status: variables.status,
				appointmentDate: variables.appointmentDate,
				appointmentTime: variables.appointmentTime,
				providerName: variables.providerName,
			}),
		);
	}
}
