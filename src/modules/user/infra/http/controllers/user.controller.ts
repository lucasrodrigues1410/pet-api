import {
	BadRequestException,
	Controller,
	Get,
	Query,
} from "@nestjs/common";
import {
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { ListCompanyClientsUseCase } from "@/modules/user/application/use-cases/list-company-clients.use-case";
import {
	ListCompanyClientsQueryDto,
	ListCompanyClientsResponseDto,
} from "../dtos/list-company-clients.dto";
import { ClientListPresenter } from "../presenters/client-list.presenter";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly listCompanyClientsUseCase: ListCompanyClientsUseCase,
	) {}

	@Get("company/clients")
	@ApiOperation({
		summary: "Listar clientes que fizeram agendamentos na empresa",
		operationId: "listCompanyClients",
	})
	@ZodResponse({ status: 200, type: ListCompanyClientsResponseDto })
	async listCompanyClients(
		@User("sub") userId: string,
		@Query() query: ListCompanyClientsQueryDto,
	) {
		const result = await this.listCompanyClientsUseCase.execute({
			userId,
			query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return ClientListPresenter.present(result.value.clients);
	}
}
