import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";

export class AppointmentChangeStatusEvent {
	constructor(
		public readonly userName: string,
		public readonly userEmail: string,
		public readonly petName: string,
		public readonly serviceName: string,
		public readonly status: AppointmentStatus,
		public readonly appointmentDate: string,
		public readonly appointmentTime: string,
		public readonly providerName: string,
	) {}
}