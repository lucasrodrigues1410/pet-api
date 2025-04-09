import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { AppointmentBookingUseCase } from "@/modules/scheduling-payment/application/use-cases/appointment-booking.use-case";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAppointmentRequestDto } from "../dtos/create-appointment.dto";

@ApiTags("Agendamentos")
@Controller("appointments/payment-orchestrator")
export class SchedulingPaymentController {
	constructor(
		private readonly createAppointmentUseCase: AppointmentBookingUseCase,
	) {}

	@Post("create")
	@ApiOperation({
		summary: "Cria um agendamento, iniciando o processo de pagamento",
		description:
			"Inicia o processo de criação de um agendamento, verificando a disponibilidade do horário e criando uma intenção de agendamento.",
	})
	@ApiOkResponse({
		description: "Retorna o agendamento criado",
	})
	@UserTypeDecorator("CUSTOMER")
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
			throw new BadRequestException(
				`Error creating appointment: ${response.value.message}`,
			);
		}

		return response.value;
	}
}
