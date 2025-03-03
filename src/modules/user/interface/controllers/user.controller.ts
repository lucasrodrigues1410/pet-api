import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.use-case";
import { User } from "../../domain/entities/user.entity";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
import { UserResponseDto } from "../dtos/user-response.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

	@ApiOperation({ summary: "Buscar usuário autenticado" })
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({
		description: "Usuário autenticado retornado com sucesso",
		type: UserResponseDto,
	})
	@Get("me")
	async getUser(@CurrentUser("id") userId: number): Promise<User> {
		const result = await this.findUserByIdUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return result.value.user;
	}
}
