import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { AddLogoToCompanyUseCase } from "src/modules/company/application/use-cases/add-logo-to-company.use-case";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import type { UserPayload } from "@/modules/auth/infra/strategies/jwt.strategy";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { AddLogoResponseDtoClass, UploadImageDto } from "../dtos/add-logo.dto";
import { CompanyByIdResponseDto } from "../dtos/company-by-id.dto";
import {
	SearchCompaniesRequestDto,
	SearchCompaniesResponseDto,
} from "../dtos/search-companies.dto";
import { CompanyGuard } from "../guards/company.guard";

@ApiTags("Empresas")
@Controller("companies")
export class CompanyController {
	constructor(
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
		private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
		private readonly addLogoToCompanyUseCase: AddLogoToCompanyUseCase,
	) {}

	@Get("search")
	@ApiOperation({
		summary: "Buscar empresas por query e localização",
		operationId: "searchCompanies",
	})
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
	@ApiOperation({
		summary: "Buscar empresa por ID",
		operationId: "getCompanyById",
	})
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

	@Post(":id/logo")
	@ApiOperation({
		summary: "Adicionar logo à empresa",
		operationId: "addLogoToCompany",
	})
	@ZodResponse({ status: 201, type: AddLogoResponseDtoClass })
	@HttpCode(HttpStatus.CREATED)
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
	  description: 'Envio de imagem',
	  type: UploadImageDto,
	})
	async addLogo(
		@User() payload: UserPayload,
		@Param("id") companyId: string,
		@UploadedFile() file: Express.Multer.File
	) {
		const result = await this.addLogoToCompanyUseCase.execute({
			companyId,
			userId: payload.sub.toString(),
			file: file as Express.Multer.File,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return {
			message: "Logo adicionado com sucesso",
		};
	}
}
