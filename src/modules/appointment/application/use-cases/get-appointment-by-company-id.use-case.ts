import { Injectable } from "@nestjs/common";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

interface Request {
	companyId: string;
	query: PaginationQuery & {
		startDate?: Date | null;
		endDate?: Date | null;
	};
}

type Response = Either<
	ResourceNotFoundError,
	PaginationResult<
		Appointment & {
			animal: Animal & { breed: Breed };
			client: User;
			service: Service;
		}
	>
>;

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
