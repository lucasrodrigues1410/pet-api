import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async create(appointment: Appointment) {
		this.items.push(appointment);
	}

	async getByPeriod(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { serviceId, startDate, endDate } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.serviceId.toString() === serviceId &&
				appointment.startDate >= startDate
			);
		});
	}
}