import { PrismaService } from "@/core/infra/prisma/prisma.service";
import {
	CompanyAvailabilityException,
	CompanyAvailabilityExceptionProps,
} from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { PrismaCompanyAvailabilityExceptionMapper } from "@/modules/company-availability/infra/database/mappers/company-availability-exception.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export function makeCompanyAvailabilityException(
	override: Partial<CompanyAvailabilityExceptionProps> = {},
	id?: UniqueEntityID,
) {
	const companyAvailability = CompanyAvailabilityException.create(
		{
			companyId: new UniqueEntityID().toString(),
			endDate: faker.date.soon(),
			startDate: faker.date.soon(),
			reason: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return companyAvailability;
}

@Injectable()
export class CompanyAvailabilityExceptionFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaBreed(
		data: Partial<CompanyAvailabilityExceptionProps> = {},
	): Promise<CompanyAvailabilityException> {
		const exception = makeCompanyAvailabilityException(data);

		await this.prisma.companyAvailabilityException.create({
			data: PrismaCompanyAvailabilityExceptionMapper.toPrisma(exception),
		});

		return exception;
	}
}
