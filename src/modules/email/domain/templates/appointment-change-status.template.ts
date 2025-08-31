import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";

export type AppointmentStatusChangedTemplateVariables = {
	userName: string;
	petName: string;
	serviceName: string;
	status: AppointmentStatus;
	appointmentDate: string;
	appointmentTime: string;
	providerName: string;
};
