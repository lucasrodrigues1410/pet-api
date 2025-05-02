import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { SearchCompaniesRequestDto } from "@/modules/company/infra/http/dtos/search-companies.dto";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import {
	CompanyPaginatedResponse,
	CompanyResponse,
} from "../dtos/company.response.dto";
import { CompanyPresenter } from "../presenters/company.presenter";

@ApiTags("Empresas")
@Controller("company")
export class CompanyController {
	constructor(
		private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
	) {}

	@Post("search")
	@ApiOperation({ summary: "Pesquisar empresas por query" })
	@ApiResponse({
		status: 200,
		type: CompanyPaginatedResponse,
	})
	@Public()
	async searchCompanies(
		@Body() data: SearchCompaniesRequestDto,
		@Query() query: PaginationQueryDto,
	) {
		const result = await this.searchCompaniesUseCase.execute({
			...data,
			...query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return PaginationPresenter.toHTTP({
			items: result.value.items.map(CompanyPresenter.toHTTP),
			meta: result.value.meta,
		});
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar empresa por ID" })
	@ApiResponse({
		status: 200,
		type: CompanyResponse,
	})
	@Public()
	async getCompanyById(@Param("id") id: string) {
		const result = await this.getCompanyByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		const company = result.value.company;
		return CompanyPresenter.toHTTP(company);
	}
}
