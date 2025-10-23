import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

interface ListCompanyClientsUseCaseRequest {
	userId: string;
	query: PaginationQuery & { search?: string };
}

type ListCompanyClientsUseCaseResponse = Either<
	never,
	{
		clients: PaginationResult<
			User & { appointmentsCount: number; lastAppointmentDate: Date | null }
		>;
	}
>;

@Injectable()
export class ListCompanyClientsUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute({
		userId,
		query,
	}: ListCompanyClientsUseCaseRequest): Promise<ListCompanyClientsUseCaseResponse> {
		const staff = await this.staffRepository.findByUserId(userId);
		if (!staff) {
			throw new Error("Staff not found for the given user ID");
		}

		const companyId = staff.companyId.toString();
		const clients = await this.userRepository.findClientsByCompanyId({
			companyId,
			query,
		});

		return right({ clients });
	}
}
