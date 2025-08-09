import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	CompanyAvailability,
	DaysOfWeek,
} from "../../domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "../../domain/repositories/company-availability.repository";

interface UpsertCompanyAvailabilityRequest {
	companyId: string;
	day: DaysOfWeek;
	startTime: string;
	endTime: string;
	lunchStartTime: string;
	lunchEndTime: string;
}

type UpsertCompanyAvailabilityResponse = Either<
	ResourceNotFoundError,
	{ availability: CompanyAvailability }
>;

@Injectable()
export class UpsertCompanyAvailabilityUseCase {
	constructor(
		private readonly availabilityRepo: CompanyAvailabilityRepository,
	) {}

	async execute(
		data: UpsertCompanyAvailabilityRequest,
	): Promise<UpsertCompanyAvailabilityResponse> {
		const availability = CompanyAvailability.create({
			companyId: new UniqueEntityID(data.companyId),
			day: data.day,
			startTime: data.startTime,
			endTime: data.endTime,
			lunchStartTime: data.lunchStartTime,
			lunchEndTime: data.lunchEndTime,
		});

		const saved =
			await this.availabilityRepo.upsertByCompanyAndDay(availability);
		return right({ availability: saved });
	}
}
