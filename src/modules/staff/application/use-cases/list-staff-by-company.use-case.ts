import { Injectable } from "@nestjs/common";
import { Staff, StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";

interface ListStaffByCompanyUseCaseRequest {
	companyId: string;
	query: PaginationQuery & { query?: string; roles?: StaffRole[] };
}

type ListStaffByCompanyUseCaseResponse = Either<
	null,
	PaginationResult<Staff & { user: User }>
>;

@Injectable()
export class ListStaffByCompanyUseCase {
	constructor(private readonly staffRepository: StaffRepository) {}

	async execute({
		companyId,
		query,
	}: ListStaffByCompanyUseCaseRequest): Promise<ListStaffByCompanyUseCaseResponse> {
		const items = await this.staffRepository.findByCompanyId(companyId, query);
		return right(items);
	}
}
