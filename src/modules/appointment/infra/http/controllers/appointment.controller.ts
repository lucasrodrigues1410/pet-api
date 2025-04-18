import { PaginationQueryDto } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { GetAppointmentByIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-user-id.use-case";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import {
	AppointmentDetailsPaginatedResponse,
	AppointmentResponse,
} from "../dtos/appointment.response.dto";
import { AppointmentPresenter } from "../presenters/appointment.presenter";

@ApiTags("Agendamentos")
@Controller("appointment")
export class AppointmentController {
	constructor(
		private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
		private readonly getAppointmentByUserIdUseCase: GetAppointmentByUserIdUseCase,
	) {}

	@Get(":id")
	@ApiOperation({
		summary: "Retorna um agendamento pelo ID",
	})
	@ApiResponse({
		status: 200,
		type: AppointmentResponse,
	})
	@UserTypeDecorator("CUSTOMER", "COMPANY")
	async getAppointmentById(
		@Param("id") userId: string,
		@User("sub") id: string,
	) {
		const response = await this.getAppointmentByIdUseCase.execute({
			id,
			userId,
		});

		if (response.isLeft()) {
			throw new NotFoundException(response.value.message);
		}

		return AppointmentPresenter.toHTTP(response.value);
	}

	@Get("/user")
	@ApiOperation({
		summary: "Retorna todos os agendamentos do cliente",
	})
	@ApiResponse({
		status: 200,
		type: AppointmentDetailsPaginatedResponse,
	})
	@UserTypeDecorator("CUSTOMER")
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
