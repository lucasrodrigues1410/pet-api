import { GetAppointmentByIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-id.use-case";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AppointmentPresenter } from "../presenters/appointment.presenter";
import { AppointmentResponse } from "../dtos/appointment.response.dto";

@ApiTags("Agendamentos")
@Controller("appointment")
export class AppointmentController {
	constructor(
		private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
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
}
