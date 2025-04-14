import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { DateRange } from "@/shared/types/date-range";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async findById(id: string) {
		const result = this.items.find((appointment) => appointment.id.toString() === id);
		if (!result) return null;
		return result;
	}

	async create(appointment: Appointment) {
		this.items.push(appointment);
	}

	async getByPeriod(params: {
		serviceId: string;
		range: DateRange;
	}) {
		const { serviceId, range } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.serviceId.toString() === serviceId &&
				appointment.startDate >= range.startDate
			);
		});
	}
}
