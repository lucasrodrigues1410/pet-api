import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { CreateAppointmentUseCase } from "@/modules/scheduling/application/use-cases/create-appointment.use-case";
import { ListAvailableDatesUseCase } from "@/modules/scheduling/application/use-cases/list-available-dates.use-case";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAppointmentRequestDto } from "../dtos/create-appointment.dto";
import { ListAvailableDatesRequestDto } from "../dtos/list-available-dates.request.dto";
import { ListAvailableDatesResponseDto } from "../dtos/list-available-dates.response.dto";

@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
	constructor(
		private readonly listAvailableDatesUseCase: ListAvailableDatesUseCase,
		private readonly createAppointmentUseCase: CreateAppointmentUseCase,
	) {}

	@ApiOperation({
		summary: "Lista as datas disponíveis para um serviço e empresa específicos",
	})
	@ApiOkResponse({
		description: "Retorna as datas disponíveis para agendamento",
		type: ListAvailableDatesResponseDto,
	})
	@Get("available-dates/:companyId/:serviceId/:date")
	@Public()
	async listAvailableDates(
		@Param() { serviceId, companyId, date }: ListAvailableDatesRequestDto,
	) {
		const parsedDate = new Date(date);
		const result = await this.listAvailableDatesUseCase.execute({
			companyId,
			serviceId,
			date: parsedDate,
		});

		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return result.value.availableDate;
	}

	@Post("create")
	@ApiOperation({
		summary: "Cria um novo agendamento",
	})
	@ApiOkResponse({
		description: "Retorna o agendamento criado",
	})
	async createAppointment(
		@User("sub") userId: string,
		@Body() params: CreateAppointmentRequestDto,
	) {
		const response = await this.createAppointmentUseCase.execute({
			...params,
			userId,
			date: new Date(params.date),
		});

		if (response.isLeft()) {
			if (response.value instanceof NotFoundException) {
				throw new NotFoundException();
			}
			throw new BadRequestException("Error creating appointment");
		}

		return response.value;
	}
}
