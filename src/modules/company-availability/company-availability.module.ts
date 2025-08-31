import { Module } from "@nestjs/common";
import { GetCompanyAvailabilityUseCase } from "./application/use-cases/get-company-availability.use-case";
import { CompanyAvailabilityRepository } from "./domain/repositories/company-availability.repository";
import { CompanyAvailabilityExcpetionRepository } from "./domain/repositories/company-availability-exception.repository";
import { PrismaCompanyAvailabilityRepository } from "./infra/database/repositories/company-availability.repository";
import { PrismaCompanyAvailabilityExceptionRepository } from "./infra/database/repositories/company-availability-exception.repository";
import { CompanyAvailabilityController } from "./infra/http/controllers/company-availability.controller";

@Module({
	controllers: [CompanyAvailabilityController],
	providers: [
		GetCompanyAvailabilityUseCase,
		{
			provide: CompanyAvailabilityRepository,
			useClass: PrismaCompanyAvailabilityRepository,
		},
		{
			provide: CompanyAvailabilityExcpetionRepository,
			useClass: PrismaCompanyAvailabilityExceptionRepository,
		},
	],
	exports: [
		{
			provide: CompanyAvailabilityRepository,
			useClass: PrismaCompanyAvailabilityRepository,
		},
		{
			provide: CompanyAvailabilityExcpetionRepository,
			useClass: PrismaCompanyAvailabilityExceptionRepository,
		},
	],
})
export class CompanyAvailabilityModule {}
