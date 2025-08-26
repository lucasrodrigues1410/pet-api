import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { GetCompanyAvailabilityUseCase } from "@/modules/company-availability/application/use-cases/get-company-availability.use-case";
import { CompanyAvailabilityListResponseDto } from "../dtos/company-availability.response.dto";

@ApiTags("Disponibilidade da Empresa")
@Controller("availabilities")
export class CompanyAvailabilityController {
	constructor(private readonly getUseCase: GetCompanyAvailabilityUseCase) {}

	@Get("company/:companyId")
	@ApiOperation({ summary: "Listar disponibilidade da empresa" })
	@ZodResponse({ status: 200, type: CompanyAvailabilityListResponseDto })
	@Public()
	async list(@Param("companyId") companyId: string) {
		const result = await this.getUseCase.execute({ companyId });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return {
			items: result.value.items.map((a) => a.toObject()),
		};
	}
}
