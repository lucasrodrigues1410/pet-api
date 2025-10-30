import { Injectable } from "@nestjs/common";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import {
	Appointment,
	AppointmentStatus,
} from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

interface Request {
	userId: string;
	companyId: string;
	query: PaginationQuery & {
		startDate?: Date;
		endDate?: Date;
		status?: AppointmentStatus[];
		query?: string;
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
	constructor(
		private readonly appointmentRepo: AppointmentRepository,
		private readonly staffRepo: StaffRepository,
	) {}

	async execute({ userId, companyId, query }: Request): Promise<Response> {
		const staff = await this.staffRepo.findByUserId(userId, companyId);
		if (!staff) {
			return left(new NotAllowedError("The user is not a staff member"));
		}
		const result = await this.appointmentRepo.findByCompanyId({
			companyId,
			query,
		});
		return right(result);
	}
}
