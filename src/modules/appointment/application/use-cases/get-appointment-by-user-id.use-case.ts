import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import {
	Appointment,
	AppointmentStatus,
} from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type GetAppointmentByUserIdUseCaseInput = {
	userId: string;
	query: PaginationQuery & {
		startDate?: Date;
		endDate?: Date;
		status?: AppointmentStatus[];
	};
};

type GetAppointmentByUserIdUseCaseOutput = Either<
	null,
	PaginationResult<
		Appointment & {
			animal: Animal;
			service: Service;
		}
	>
>;

export class GetAppointmentByUserIdUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(
		params: GetAppointmentByUserIdUseCaseInput,
	): Promise<GetAppointmentByUserIdUseCaseOutput> {
		const appointment = await this.appointmentRepository.findByUserId({
			userId: params.userId,
			query: params.query,
		});
		return right(appointment);
	}
}
