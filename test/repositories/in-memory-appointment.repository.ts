import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { DateRange } from "@/shared/types/date-range";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async findById(id: string) {
		const result = this.items.find(
			(appointment) => appointment.id.toString() === id,
		);
		if (!result) return null;
		return result as Awaited<ReturnType<AppointmentRepository["findById"]>>;
	}

	async findByUserId(
		params: Parameters<AppointmentRepository["findByUserId"]>[0],
	) {
		const result = await paginate(
			async () =>
				this.items.filter((appointment) => {
					return appointment.clientId.toString() === params.userId;
				}),
			async () => this.items.length,
			params.query,
		);

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

	async update(appointment: Appointment) {
		const index = this.items.findIndex(
			(item) => item.id.toString() === appointment.id.toString(),
		);
		if (index !== -1) {
			this.items[index] = appointment;
		}
	}
}
