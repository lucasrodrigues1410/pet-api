import { Module } from "@nestjs/common";
import { CreateCompanyUseCase } from "./application/use-cases/create-company.use-case";
import { DeleteCompanyUseCase } from "./application/use-cases/delete-company.use-case";
import { GetCompanyByIdUseCase } from "./application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "./application/use-cases/search-companies.use-case";
import { UpdateCompanyUseCase } from "./application/use-cases/update-company.use-case";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { PrismaCompanyRepository } from "./infra/database/repositories/prisma-company.repository";
import { CompanyController } from "./infra/http/controllers/company.controller";

@Module({
	controllers: [CompanyController],
	providers: [
		SearchCompaniesUseCase,
		GetCompanyByIdUseCase,
		CreateCompanyUseCase,
		UpdateCompanyUseCase,
		DeleteCompanyUseCase,
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
