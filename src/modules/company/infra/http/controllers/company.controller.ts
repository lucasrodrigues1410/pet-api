import {
	Controller,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CompanyByIdResponseDto } from "../dtos/company-by-id.dto";
import {
	SearchCompaniesRequestDto,
	SearchCompaniesResponseDto,
} from "../dtos/search-companies.dto";

@ApiTags("Empresas")
@Controller("companies")
export class CompanyController {
	constructor(
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
		private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
	) {}

	@Get("search")
	@ApiOperation({ summary: "Buscar empresas por query e localização",operationId: "searchCompanies" })
	@ZodResponse({ status: 200, type: SearchCompaniesResponseDto })
	@Public()
	async searchCompanies(
		@Query() searchParams: SearchCompaniesRequestDto,
		@Query() pagination: PaginationQueryDto,
	) {
		const result = await this.searchCompaniesUseCase.execute({
			query: searchParams.query,
			location: searchParams.location,
			pagination,
		});

		if (result.isLeft()) {
			throw new InternalServerErrorException();
		}

		return {
			items: result.value.companies.items.map((company) => ({
				...company.toObject(),
				address: company.address.toObject(),
				image: company.image?.toObject() ?? null,
			})),
			meta: result.value.companies.meta,
		};
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar empresa por ID",operationId: "getCompanyById" })
	@ZodResponse({ status: 200, type: CompanyByIdResponseDto })
	@Public()
	async getCompanyById(@Param("id") id: string) {
		const result = await this.getCompanyByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return {
			...result.value.company.toObject(),
			address: result.value.company.address.toObject(),
			images: result.value.company.images?.map((i) => i.toObject()) ?? [],
			services: result.value.company.services?.map((s) => s.toObject()) ?? [],
			availabilities:
				result.value.company.availabilities?.map((a) => a.toObject()) ?? [],
		};
	}
}
