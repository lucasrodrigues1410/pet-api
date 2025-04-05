import { AppointmentIntent } from "@/modules/appointment/domain/entities/appointment-intent.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
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

export class InMemoryAppointmentIntentRepository
	implements AppointmentIntentRepository
{
	public items: AppointmentIntent[] = [];

	async create(appointment: AppointmentIntent) {
		this.items.push(appointment);
	}

	async findById(id: string) {
		const appointment = this.items.find((item) => item.id.toString() === id);
		if (!appointment) {
			return null;
		}
		return appointment;
	}

	async findValidInRange(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { serviceId, startDate, endDate } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.serviceId.toString() === serviceId &&
				appointment.startDate >= startDate &&
				appointment.endDate <= endDate &&
				appointment.validUntil >= new Date()
			);
		});
	}
}
