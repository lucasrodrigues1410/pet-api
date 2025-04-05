import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { InitiateAppointmentCreationUseCase } from "@/modules/scheduling-payment-orchestrator/application/use-cases/initiate-appointment-creation.use-case";
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
export class SchedulingPaymentOrchestratorController {
	constructor(
		private readonly createAppointmentUseCase: InitiateAppointmentCreationUseCase,
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
			throw new BadRequestException(`Error creating appointment: ${response.value.message}`);
		}

		return response.value;
	}
}
