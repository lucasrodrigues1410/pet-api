import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { GetCompanyByIdUseCase } from "src/modules/company/application/use-cases/get-company-by-id.use-case";
import { SearchCompaniesUseCase } from "src/modules/company/application/use-cases/search-companies.use-case";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserType } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CreateCompanyUseCase } from "@/modules/company/application/use-cases/create-company.use-case";
import { DeleteCompanyUseCase } from "@/modules/company/application/use-cases/delete-company.use-case";
import { UpdateCompanyUseCase } from "@/modules/company/application/use-cases/update-company.use-case";
import { SearchCompaniesRequestDto } from "@/modules/company/infra/http/dtos/search-companies.dto";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { StaffRoles } from "../../../../staff/infra/decorators/staff-roles.decorator";
import {
	CreateCompanyRequestDto,
	UpdateCompanyRequestDto,
} from "../dtos/company.dto";
import {
	CompanyPaginatedResponse,
	CompanyResponse,
} from "../dtos/company.response.dto";
import { CompanyGuard } from "../guards/company.guard";
import { CompanyPresenter } from "../presenters/company.presenter";

@ApiTags("Empresas")
@Controller("company")
export class CompanyController {
	constructor(
		private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
		private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly updateCompanyUseCase: UpdateCompanyUseCase,
		private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
	) {}

	@Post("search")
	@ApiOperation({ summary: "Pesquisar empresas por query" })
	@ApiResponse({ status: 200, type: CompanyPaginatedResponse })
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
	@ApiResponse({ status: 200, type: CompanyResponse })
	@Public()
	async getCompanyById(@Param("id") id: string) {
		const result = await this.getCompanyByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		const company = result.value.company;
		return CompanyPresenter.toHTTP(company);
	}

	@Post()
	@ApiOperation({ summary: "Criar empresa" })
	@HttpCode(201)
	@Public()
	async create(
		@User("sub") ownerUserId: string,
		@Body() data: CreateCompanyRequestDto,
	) {
		const result = await this.createCompanyUseCase.execute({
			ownerUserId,
			...data,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return CompanyPresenter.toHTTP(result.value.company);
	}

	@Put(":id")
	@HttpCode(200)
	@ApiOperation({ summary: "Atualizar empresa" })
	@UserType("COMPANY")
	@StaffRoles(StaffRole.ADMIN)
	@UseGuards(CompanyGuard)
	async update(
		@Param("id") companyId: string,
		@Body() data: UpdateCompanyRequestDto,
	) {
		const result = await this.updateCompanyUseCase.execute({
			companyId,
			...data,
		});

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}
		return CompanyPresenter.toHTTP(result.value.company);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Excluir empresa (soft delete)" })
	@HttpCode(204)
	@UserType("COMPANY")
	@UseGuards(CompanyGuard)
	@StaffRoles(StaffRole.ADMIN)
	async delete(@Param("id") companyId: string) {
		const result = await this.deleteCompanyUseCase.execute({
			companyId,
		});

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}
	}
}
