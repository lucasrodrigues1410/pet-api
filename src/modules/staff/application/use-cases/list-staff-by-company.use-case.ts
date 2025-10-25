import { Injectable } from "@nestjs/common";
import { Staff, StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";

interface ListStaffByCompanyUseCaseRequest {
	userId: string;
	query: PaginationQuery & { query?: string; roles?: StaffRole[] };
}

type ListStaffByCompanyUseCaseResponse = Either<
	ResourceNotFoundError,
	PaginationResult<Staff & { user: User }>
>;

@Injectable()
export class ListStaffByCompanyUseCase {
	constructor(private readonly staffRepository: StaffRepository) {}

	async execute({
		userId,
		query,
	}: ListStaffByCompanyUseCaseRequest): Promise<ListStaffByCompanyUseCaseResponse> {
		const staff = await this.staffRepository.findByUserId(userId);
		if (!staff) {
			return left(
				new ResourceNotFoundError("Staff not found for the given user ID"),
			);
		}

		const items = await this.staffRepository.findByCompanyId(
			staff.companyId.toString(),
			query,
		);
		return right(items);
	}
}
