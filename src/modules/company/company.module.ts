import { Module } from "@nestjs/common";
import { GetCompanyByIdUseCase } from "./application/use-cases/get-company-by-id.use-case";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { PrismaCompanyRepository } from "./infra/database/repositories/prisma-company.repository";
import { CompanyController } from "./infra/http/controllers/company.controller";

@Module({
	controllers: [CompanyController],
	providers: [
		GetCompanyByIdUseCase,
		{
			provide: CompanyRepository,
			useClass: PrismaCompanyRepository,
		},
	],
	exports: [
		{
			provide: CompanyRepository,
			useClass: PrismaCompanyRepository,
		},
	],
})
export class CompanyModule {}
