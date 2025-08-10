import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserType } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { AppointmentBookingUseCase } from "@/modules/booking/application/use-cases/appointment-booking.use-case";
import { CreateAnonymousAppointmentUseCase } from "@/modules/booking/application/use-cases/create-anonymous-appointment.use-case";
import { ListAvailableDatesUseCase } from "@/modules/booking/application/use-cases/list-available-dates.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CreateAnonymousAppointmentRequestDto } from "../dtos/create-anonymous-appointment.dto";
import { CreateAppointmentRequestDto } from "../dtos/create-appointment.dto";
import {
	ListAvailableDatesRequestDto,
	ListAvailableDatesResponseDto,
} from "../dtos/list-available-dates.dto";

@ApiTags("Reservas")
@Controller("booking")
export class BookingController {
	constructor(
		private readonly listAvailableDatesUseCase: ListAvailableDatesUseCase,
		private readonly createAppointmentUseCase: AppointmentBookingUseCase,
		private readonly createAnonymousAppointmentUseCase: CreateAnonymousAppointmentUseCase,
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
	): Promise<ListAvailableDatesResponseDto> {
		const parsedDate = new Date(date);
		const result = await this.listAvailableDatesUseCase.execute({
			companyId,
			serviceId,
			date: parsedDate,
		});

		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return {
			slots: result.value.slots.map((slot) => ({
				label: slot.label || "",
			})),
		};
	}

	@Post("create")
	@HttpCode(201)
	@ApiOperation({
		summary: "Cria um agendamento, iniciando o processo de pagamento",
		description:
			"Inicia o processo de criação de um agendamento, verificando a disponibilidade do horário e criando uma intenção de agendamento.",
	})
	@ApiOkResponse({
		description: "Retorna o agendamento criado",
	})
	@UserType("CUSTOMER")
	async createAppointment(
		@User("sub") userId: string,
		@Body() params: CreateAppointmentRequestDto,
	) {
		const response = await this.createAppointmentUseCase.execute({
			...params,
			clientId: userId,
			date: new Date(params.date),
		});

		if (response.isLeft()) {
			if (response.value instanceof NotFoundException) {
				throw new NotFoundException();
			}
			throw new BadRequestException(`${response.value.message}`);
		}

		return {
			appointmentId: response.value.appointmentId,
		};
	}

	@Post("create-anonymous")
	@HttpCode(201)
	@Public()
	@ApiOperation({
		summary: "Cria um agendamento anônimo",
		description:
			"Cria um agendamento para clientes não cadastrados, criando usuário e animal temporários automaticamente.",
	})
	@ApiOkResponse({
		description: "Retorna o agendamento anônimo criado",
	})
	@UserType("COMPANY")
	async createAnonymousAppointment(
		@Body() params: CreateAnonymousAppointmentRequestDto,
	) {
		const response = await this.createAnonymousAppointmentUseCase.execute({
			...params,
			date: new Date(params.date),
		});

		if (response.isLeft()) {
			if (response.value instanceof ResourceNotFoundError) {
				throw new NotFoundException(response.value.message);
			}
			throw new BadRequestException(`${response.value.message}`);
		}

		return {
			appointmentId: response.value.appointmentId,
			animalId: response.value.animalId,
			clientId: response.value.clientId,
		};
	}
}
