import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";
import { Either, right } from "@/shared/either";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type GetAppointmentByUserIdUseCaseInput = {
	userId: string;
	query: PaginationQuery;
};

type GetAppointmentByUserIdUseCaseOutput = Either<
	null,
	PaginationResult<Appointment>
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
