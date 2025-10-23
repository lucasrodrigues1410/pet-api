import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface DeactivateServiceUseCaseRequest {
	id: string;
	companyId: string;
	userId: string;
}

type DeactivateServiceUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeactivateServiceUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute({
		id,
		companyId,
		userId,
	}: DeactivateServiceUseCaseRequest): Promise<DeactivateServiceUseCaseResponse> {
		const existingService = await this.serviceRepository.findById(id);
		const staff = await this.staffRepository.findByUserId(userId);

		if (!staff || staff.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError());
		}

		if (["admin", "manager"].includes(staff.role) === false) {
			//TODO: Create a specific error for unauthorized actions
			return left(new ResourceNotFoundError());
		}

		if (
			!existingService ||
			existingService.companyId.toString() !== companyId
		) {
			return left(new ResourceNotFoundError());
		}

		await this.serviceRepository.update(id, { isActive: false });

		return right(null);
	}
}
