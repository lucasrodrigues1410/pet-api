import { Either, right } from "@/core/either";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { Injectable } from "@nestjs/common";

type CalculateUnavailableSlotsUseCaseResponse = Either<
	null,
	{
		slots: [Date, Date][];
	}
>;

@Injectable()
export class CalculateUnavailableSlotsUseCase {
	constructor(private appointmentRepository: AppointmentRepository) {}

	async execute(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<CalculateUnavailableSlotsUseCaseResponse> {
		const appointments =
			await this.appointmentRepository.getAppointmentsByPeriod({
				companyId,
				startDate,
				endDate,
			});

		const unavailableSlotsSet = new Set() as Set<string>;

		for (const appointment of appointments) {
			unavailableSlotsSet.add(
				`${appointment.startDate}-${appointment.endDate}`,
			);
		}

		const unavailableSlots = Array.from(unavailableSlotsSet).map((slot) => {
			const [start, end] = slot.split("-");
			return [new Date(start), new Date(end)];
		}) as [Date, Date][];

		return right({
			slots: unavailableSlots,
		});
	}
}
