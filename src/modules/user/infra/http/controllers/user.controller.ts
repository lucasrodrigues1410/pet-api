import { FindUserByIdUseCase } from "@/modules/user/application/use-cases/find-user-by-id.use-case";
import { UpdateUserProfileUseCase } from "@/modules/user/application/use-cases/update-user-profile.use-case";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Put,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UpdateUserRequestDto } from "../dtos/update-user.dto";
import { UserResponseDto } from "../dtos/user.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly findUserByIdUseCase: FindUserByIdUseCase,
		private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
	) {}

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

	@ApiOperation({ summary: "Editar usuário autenticado" })
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOkResponse({
		description: "Usuário autenticado editado com sucesso",
	})
	@Put("edit")
	async editUser(
		@User("sub") userId: string,
		@Body() params: UpdateUserRequestDto,
	) {
		const response = await this.updateUserProfileUseCase.execute({
			userId,
			profileData: params,
		});

		if (response.isLeft()) {
			throw new BadRequestException(response.value.message);
		}
	}
}
