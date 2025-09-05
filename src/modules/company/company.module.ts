import { Module } from "@nestjs/common";
import { AssetModule } from "@/modules/asset/asset.module";
import { AddLogoToCompanyUseCase } from "./application/use-cases/add-logo-to-company.use-case";
import { GetCompanyByIdUseCase } from "./application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "./application/use-cases/search-companies.use-case";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { PrismaCompanyRepository } from "./infra/database/repositories/prisma-company.repository";
import { CompanyController } from "./infra/http/controllers/company.controller";

@Module({
	imports: [AssetModule],
	controllers: [CompanyController],
	providers: [
		GetCompanyByIdUseCase,
		SearchCompaniesUseCase,
		AddLogoToCompanyUseCase,
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
