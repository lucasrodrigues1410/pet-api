import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { DaysOfWeek } from "../../domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "../../domain/repositories/company-availability.repository";

interface DeleteCompanyAvailabilityRequest {
	companyId: string;
	day: DaysOfWeek;
}

type DeleteCompanyAvailabilityResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteCompanyAvailabilityUseCase {
	constructor(
		private readonly availabilityRepo: CompanyAvailabilityRepository,
	) {}

	async execute(
		data: DeleteCompanyAvailabilityRequest,
	): Promise<DeleteCompanyAvailabilityResponse> {
		await this.availabilityRepo.deleteByCompanyAndDay(data.companyId, data.day);
		return right(undefined);
	}
}
