import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";

export interface WelcomePayload {
	userId: string;
	name: string;
	email: string;
}

export interface EmployeeInvitePayload {
	email: string;
	name: string;
	expiresAt: Date;
	acceptInviteUrl: string;
}

export interface AppointmentChangeStatusPayload {
	appointmentStatus: AppointmentStatus;
	userName: string;
	userEmail: string;
	petName: string;
	serviceName: string;
	providerName: string;
	appointmentId: string;
	clientId: string;
	updatedOn: Date;
}

export type MyJobPayloadsMap = {
	welcome: WelcomePayload;
	"employee-invite": EmployeeInvitePayload;
	"appointment-change-status": AppointmentChangeStatusPayload;
};

export type NotificationJobOptions = keyof MyJobPayloadsMap;
