import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyByIdResponseDTO } from "src/modules/company/application/dtos/company-by-id.response.dto";
import { SearchCompaniesResponseDto } from "src/modules/company/application/dtos/search-companies.request.dto";
import { SearchCompaniesRequestDto } from "src/modules/company/application/dtos/search-companies.response.dto";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case ";

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
	async searchCompanies(@Body() data: SearchCompaniesRequestDto) {
		const result = await this.searchCompaniesUseCase.execute(data);
		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const companies = result.value.companies;
		return companies.map((company) => ({
			id: company.id,
			name: company.name,
		}));
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
	async getCompanyById(@Param("id") id: number) {
		const result = await this.getCompanyByIdUseCase.execute({ id: +id });
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
