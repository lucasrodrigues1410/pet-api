import { Module } from "@nestjs/common";
import { CompanyController } from "./infra/http/controllers/company.controller";
import { ListOpenCompaniesUseCase } from "./application/use-cases/list-open-companies.use-case ";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { CompanyPrismaRepository } from "./infra/database/prisma/repositories/company.repository";

@Module({
	controllers: [CompanyController],
	providers: [
		ListOpenCompaniesUseCase,
		{
			provide: CompanyRepository,
			useClass: CompanyPrismaRepository,
		},
	],
})
export class companyModule {}
