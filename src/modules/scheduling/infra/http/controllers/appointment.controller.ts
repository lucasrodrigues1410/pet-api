import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { ListAvailableDatesUseCase } from "@/modules/scheduling/application/use-cases/list-available-dates.use-case";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ListAvailableDatesRequestDto } from "../dtos/list-available-dates.request.dto";
import { ListAvailableDatesResponseDto } from "../dtos/list-available-dates.response.dto";

@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
	constructor(
		private readonly listAvailableDatesUseCase: ListAvailableDatesUseCase,
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
}
