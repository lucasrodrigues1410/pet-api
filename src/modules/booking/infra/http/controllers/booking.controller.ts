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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { AppointmentBookingUseCase } from "@/modules/booking/application/use-cases/appointment-booking.use-case";
import { ListAvailableDatesUseCase } from "@/modules/booking/application/use-cases/list-available-dates.use-case";
import { UserType } from "@/modules/user/domain/entities/user.entity";
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
	) {}

	@ApiOperation({
		summary: "Lista as datas disponíveis para um serviço e empresa específicos",
	})
	@ZodResponse({ status: 200, type: ListAvailableDatesResponseDto })
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
	@UserTypeDecorator(UserType.CUSTOMER)
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
}
