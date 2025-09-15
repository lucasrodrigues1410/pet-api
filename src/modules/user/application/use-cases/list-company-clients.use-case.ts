import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

interface ListCompanyClientsUseCaseRequest {
	companyId: string;
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
	constructor(private readonly userRepository: UserRepository) {}

	async execute({
		companyId,
		query,
	}: ListCompanyClientsUseCaseRequest): Promise<ListCompanyClientsUseCaseResponse> {
		const clients = await this.userRepository.findClientsByCompanyId({
			companyId,
			query,
		});

		return right({ clients });
	}
}
