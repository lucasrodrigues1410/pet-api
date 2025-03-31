import { Module } from "@nestjs/common";
import { CompanyAvailabilityExcpetionRepository } from "./domain/repositories/company-availability-exception.repository";
import { CompanyAvailabilityRepository } from "./domain/repositories/company-availability.repository";
import { PrismaCompanyAvailabilityExceptionRepository } from "./infra/database/repositories/company-availability-exception.repository";
import { PrismaCompanyAvailabilityRepository } from "./infra/database/repositories/company-availability.repository";

@Module({
	providers: [
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
