import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { AnimalPresenter } from "@/modules/animal/infra/http/presenters/animal.presenter";
import { GetAppointmentByCompanyIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-company-id.use-case";
import { GetAppointmentByIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-user-id.use-case";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserType } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";
import { ServicePresenter } from "@/modules/service/infra/http/presenters/service.presenter";
import { UserPresenter } from "@/modules/user/infra/http/presenters/user.presenter";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import {
	AppointmentDetailResponse,
	AppointmentDetailsPaginatedResponse,
} from "../dtos/appointment.response.dto";
import { AppointmentPresenter } from "../presenters/appointment.presenter";

@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
	constructor(
		private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
		private readonly getAppointmentByUserIdUseCase: GetAppointmentByUserIdUseCase,
		private readonly getAppointmentByCompanyIdUseCase: GetAppointmentByCompanyIdUseCase,
	) {}

	@Get(":id")
	@ApiOperation({
		summary: "Retorna um agendamento pelo ID",
	})
	@ApiResponse({
		status: 200,
		type: AppointmentDetailResponse,
	})
	@UserType("CUSTOMER", "COMPANY")
	async getAppointmentById(
		@Param("id") userId: string,
		@User("sub") id: string,
	): Promise<AppointmentDetailResponse> {
		const response = await this.getAppointmentByIdUseCase.execute({
			id,
			userId,
		});

		if (response.isLeft()) {
			throw new NotFoundException(response.value.message);
		}

		return {
			...AppointmentPresenter.toHTTP(response.value),
			animal: AnimalPresenter.toHTTP(response.value.animal),
			client: UserPresenter.toHTTP(response.value.client),
			service: ServicePresenter.toHTTP(response.value.service),
			company: CompanyPresenter.toHTTP(response.value.company),
		};
	}

	@Get("/company/:companyId")
	@ApiOperation({ summary: "Retorna todos os agendamentos da empresa" })
	@ApiResponse({ status: 200, type: AppointmentDetailsPaginatedResponse })
	@UserType("COMPANY")
	@UseGuards(CompanyGuard)
	async getAllCompanyAppointments(
		@Param("companyId") companyId: string,
		@Query() query: PaginationQueryDto,
	) {
		const response = await this.getAppointmentByCompanyIdUseCase.execute({
			companyId,
			query,
		});

		if (response.isLeft()) {
			throw new NotFoundException(response.value.message);
		}

		return PaginationPresenter.toHTTP({
			meta: response.value.meta,
			items: response.value.items.map(AppointmentPresenter.toHTTP),
		});
	}

	@Get("/user")
	@ApiOperation({
		summary: "Retorna todos os agendamentos do cliente",
	})
	@ApiResponse({
		status: 200,
		type: AppointmentDetailsPaginatedResponse,
	})
	@UserType("CUSTOMER")
	async getAllAppointments(
		@User("sub") userId: string,
		@Query() query: PaginationQueryDto,
	) {
		const response = await this.getAppointmentByUserIdUseCase.execute({
			userId,
			query,
		});

		if (response.isLeft()) {
			throw new NotFoundException();
		}

		return PaginationPresenter.toHTTP({
			meta: response.value.meta,
			items: response.value.items.map(AppointmentPresenter.toHTTP),
		});
	}
}
