import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { AppointmentBookingUseCase } from "@/modules/booking/application/use-cases/appointment-booking.use-case";
import { ListAvailableDatesUseCase } from "@/modules/booking/application/use-cases/list-available-dates.use-case";
import {
	CreateAppointmentRequestDto,
	CreateAppointmentResponseDto,
} from "../dtos/create-appointment.dto";
import {
	ListAvailableDatesRequestDto,
	ListAvailableDatesResponseDto,
} from "../dtos/list-available-dates.dto";
import { AvailableDatesPresenter } from "../presenters/available-dates.presenter";
import { CreateAppointmentPresenter } from "../presenters/create-appointment.presenter";

@ApiTags("Reservas")
@Controller("booking")
export class BookingController {
	constructor(
		private readonly listAvailableDatesUseCase: ListAvailableDatesUseCase,
		private readonly createAppointmentUseCase: AppointmentBookingUseCase,
	) {}

	@ApiOperation({
		summary: "Lista as datas disponíveis para um serviço e empresa específicos",
		operationId: "listAvailableDates",
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

		return AvailableDatesPresenter.present(result.value.slots);
	}

	@Post("create")
	@ZodResponse({ status: 201, type: CreateAppointmentResponseDto })
	@ApiOperation({
		summary: "Iniciando o processo de pagamento",
		operationId: "createAppointment",
	})
	async createAppointment(
		@User("sub") userId: string,
		@Body() params: CreateAppointmentRequestDto,
	) {
		const response = await this.createAppointmentUseCase.execute({
			...params,
			clientId: userId,
			startDate: new Date(params.date),
		});

		if (response.isLeft()) {
			if (response.value instanceof NotFoundException) {
				throw new NotFoundException();
			}
			throw new BadRequestException(`${response.value.message}`);
		}

		return CreateAppointmentPresenter.present({
			appointmentId: response.value.appointmentId,
			checkoutUrl: response.value.checkoutUrl,
		});
	}
}
