import { BadRequestException, Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { OpenCompanyResponseDto } from "src/modules/company/application/dtos/open-company-response.dto";
import { ListOpenCompaniesUseCase } from "src/modules/company/application/use-cases/list-open-companies.use-case ";

@ApiTags("Empresas")
@Controller("company")
export class CompanyController {
	constructor(
		private readonly listCompaniesOpenedUseCase: ListOpenCompaniesUseCase,
	) {}

	@ApiOperation({ summary: "Listar todas as empresas abertas" })
	@ApiOkResponse({
		description: "Empresas abertas listadas com sucesso",
		type: OpenCompanyResponseDto,
	})
	@Get("open")
	@UserTypeDecorator('CUSTOMER')
	async listOpenCompanies() {
		const result = await this.listCompaniesOpenedUseCase.execute();
		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return result.value.companies.map((company) => ({
			id: company.id,
			name: company.name,
		}));
	}
}
