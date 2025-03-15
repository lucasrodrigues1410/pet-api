import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyByIdResponseDTO } from "src/modules/company/application/dtos/company-by-id.response.dto";
import { OpenCompanyResponseDto } from "src/modules/company/application/dtos/open-company-response.dto";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { ListOpenCompaniesUseCase } from "src/modules/company/application/use-cases/list-open-companies.use-case ";

@ApiTags("Empresas")
@Controller("company")
export class CompanyController {
	constructor(
		private readonly listCompaniesOpenedUseCase: ListOpenCompaniesUseCase,
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
	) {}

	@ApiOperation({ summary: "Listar todas as empresas abertas" })
	@ApiOkResponse({
		description: "Empresas abertas listadas com sucesso",
		type: OpenCompanyResponseDto,
	})
	@Get("open")
	@UserTypeDecorator("CUSTOMER")
	async listOpenCompanies() {
		const result = await this.listCompaniesOpenedUseCase.execute();
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
	async getCompanyById(@Param("id") id: number) {
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
