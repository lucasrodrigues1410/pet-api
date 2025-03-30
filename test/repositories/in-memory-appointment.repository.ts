import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async create(appointment: Appointment) {
		this.items.push(appointment);
	}

	async getAppointmentsByPeriod(params: {
		companyId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { companyId, startDate, endDate } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.companyId === companyId &&
				appointment.startDate >= startDate &&
				appointment.endDate <= endDate
			);
		});
	}
}
