import { PaginationParamsQuery } from "@/core/pagination/pagination-params";
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
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import { CompanyByIdResponseDTO } from "@/modules/company/infra/http/dtos/company-by-id.dto";
import { SearchCompaniesRequestDto, SearchCompaniesResponseDto } from "@/modules/company/infra/http/dtos/search-companies.dto";
import { CompanyPresenter } from "../presenters/company.presenter";
import { PaginationResultPresenter } from "@/core/pagination/pagination-presenter";

@ApiTags("Empresas")
@Controller("company")
export class CompanyController {
	constructor(
		private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
	) {}

	@ApiOperation({ summary: "Pesquisar empresas por query" })
	@ApiOkResponse({
		description: "Empresas encontradas com sucesso",
		type: SearchCompaniesResponseDto,
	})
	@Post("search")
	@Public()
	async searchCompanies(
		@Body() data: SearchCompaniesRequestDto,
		@Query() query: PaginationParamsQuery,
	) {
		const result = await this.searchCompaniesUseCase.execute({
			...data,
			...query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return PaginationResultPresenter.toHTTP({
			...result.value,
			items: result.value.items.map(CompanyPresenter.toHTTP),
		});
	}

	@ApiOperation({ summary: "Buscar empresa por ID" })
	@ApiOkResponse({
		description: "Empresa encontrada com sucesso",
		type: CompanyByIdResponseDTO,
	})
	@ApiResponse({
		status: 404,
		description: "Empresa não encontrada",
	})
	@Get(":id")
	@Public()
	async getCompanyById(@Param("id") id: string) {
		const result = await this.getCompanyByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		const company = result.value.company;
		return {
			id: company.id,
			name: company.name,
		};
	}
}
