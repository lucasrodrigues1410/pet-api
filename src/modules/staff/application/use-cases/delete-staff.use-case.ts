import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

interface DeleteStaffUseCaseRequest {
	id: string;
	companyId: string;
}

type DeleteStaffUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteStaffUseCase {
	constructor(private readonly staffRepository: StaffRepository) {}

	async execute({
		id,
		companyId,
	}: DeleteStaffUseCaseRequest): Promise<DeleteStaffUseCaseResponse> {
		const staff = await this.staffRepository.findById(id);
		if (!staff || staff.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError());
		}

		await this.staffRepository.delete(id);
		return right(undefined);
	}
}
