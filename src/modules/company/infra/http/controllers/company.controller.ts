import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { CompanyWithAvailabilitiesAndImagesResponse } from "../dtos/company.response.dto";

@ApiTags("Empresas")
@Controller("companies")
export class CompanyController {
	constructor(private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase) {}

	@Get(":id")
	@ApiOperation({ summary: "Buscar empresa por ID" })
	@ZodResponse({ type: CompanyWithAvailabilitiesAndImagesResponse })
	@Public()
	async getCompanyById(@Param("id") id: string) {
		const result = await this.getCompanyByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return {
			...result.value.company.toObject(),
			availabilities:
				result.value.company.availabilities?.map((a) => a.toObject()) ?? [],
			images: result.value.company.images?.map((i) => i.toObject()) ?? [],
		};
	}
}
