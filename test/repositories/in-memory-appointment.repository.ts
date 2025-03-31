import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/scheduling/domain/repositories/appointment.repository";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async create(appointment: Appointment) {
		this.items.push(appointment);
	}

	async getAppointmentsByPeriod(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { serviceId, startDate, endDate } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.serviceId === serviceId &&
				appointment.startDate >= startDate
			);
		});
	}
}
