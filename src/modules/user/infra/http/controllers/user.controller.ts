import { FindUserByIdUseCase } from "@/modules/user/application/use-cases/find-user-by-id.use-case";
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UserResponseDto } from "../dtos/user.dto";

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
	async getUser(@User("sub") userId: string) {
		const result = await this.findUserByIdUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		const user = result.value.user;
		return {
			name: user.name,
			email: user.email,
			type: user.type,
		};
	}
}
