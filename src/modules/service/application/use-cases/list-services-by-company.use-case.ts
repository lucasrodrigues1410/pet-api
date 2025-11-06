import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface ListServicesByCompanyUseCaseRequest {
	companyId: string;
	userId: string;
}

type ListActiveServicesUseCaseResponse = Either<
	NotAllowedError,
	{ services: Service[] }
>;

@Injectable()
export class ListServicesByCompanyUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute({
		companyId,
		userId,
	}: ListServicesByCompanyUseCaseRequest): Promise<ListActiveServicesUseCaseResponse> {
		const staff = await this.staffRepository.findByUserId(userId, companyId);
		if (!staff) {
			return left(new NotAllowedError("User is not staff of the company"));
		}

		const services = await this.serviceRepository.findByCompanyId(companyId);
		return right({ services });
	}
}
