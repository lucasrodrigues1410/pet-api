import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

interface Request {
	companyId: string;
	query: PaginationQuery;
}

type Response = Either<ResourceNotFoundError, PaginationResult<Appointment>>;

@Injectable()
export class GetAppointmentByCompanyIdUseCase {
	constructor(private readonly appointmentRepo: AppointmentRepository) {}

	async execute({ companyId, query }: Request): Promise<Response> {
		const result = await this.appointmentRepo.findByCompanyId({
			companyId,
			query,
		});
		return right(result);
	}
}
