import { FileInterceptor } from "@nest-lab/fastify-multer";
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { AddLogoToCompanyUseCase } from "src/modules/company/application/use-cases/add-logo-to-company.use-case";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import type { UserPayload } from "@/modules/auth/infra/strategies/jwt.strategy";
import { AddLogoResponseDtoClass, UploadImageDto } from "../dtos/add-logo.dto";
import { CompanyByIdResponseDto } from "../dtos/company-by-id.dto";
import {
	SearchCompaniesRequestDto,
	SearchCompaniesResponseDto,
} from "../dtos/search-companies.dto";
import { CompanyGuard } from "../guards/company.guard";
import { CompanyByIdPresenter } from "../presenters/company-by-id.presenter";
import { SearchCompaniesPresenter } from "../presenters/search-companies.presenter";

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
	async searchCompanies(@Query() searchParams: SearchCompaniesRequestDto) {
		const result = await this.searchCompaniesUseCase.execute(searchParams);

		if (result.isLeft()) {
			throw new InternalServerErrorException();
		}

		return SearchCompaniesPresenter.present(result.value.companies);
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

		return CompanyByIdPresenter.present(result.value.company);
	}

	@Patch(":id/logo")
	@ApiOperation({
		summary: "Adicionar logo à empresa",
		operationId: "addLogoToCompany",
	})
	@ZodResponse({ status: 201, type: AddLogoResponseDtoClass })
	@HttpCode(HttpStatus.CREATED)
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({ description: "Envio de imagem", type: UploadImageDto })
	async addLogo(
		@User() payload: UserPayload,
		@Param("id") companyId: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		const result = await this.addLogoToCompanyUseCase.execute({
			companyId,
			userId: payload.sub.toString(),
			file: file as Express.Multer.File,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return { message: "Logo adicionado com sucesso" };
	}
}
