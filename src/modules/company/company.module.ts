import { Module } from "@nestjs/common";
import { CompanyController } from "./infra/http/controllers/company.controller";
import { ListOpenCompaniesUseCase } from "./application/use-cases/list-open-companies.use-case ";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { CompanyPrismaRepository } from "./infra/database/prisma/repositories/company.repository";
import { GetCompanyByIdUseCase } from "./application/use-cases/get-company-by-id.use-case";

@Module({
	controllers: [CompanyController],
	providers: [
		ListOpenCompaniesUseCase,
		GetCompanyByIdUseCase,
		{
			provide: CompanyRepository,
			useClass: CompanyPrismaRepository,
		},
	],
})
export class companyModule {}
