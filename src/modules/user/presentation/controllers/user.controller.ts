import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.use-case";
import { User } from "../../domain/entities/user.entity";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
import { UserDto } from "../dtos/user.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

	@ApiOperation({ summary: "Buscar usuário autenticado" })
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({
		description: "Usuário autenticado retornado com sucesso",
		type: UserDto,
	})
	@ApiUnauthorizedResponse({ description: "Usuário não autenticado" })
	@Get("me")
	async getUser(@CurrentUser("id") userId: number): Promise<User> {
		return this.findUserByIdUseCase.execute(userId);
	}
}
