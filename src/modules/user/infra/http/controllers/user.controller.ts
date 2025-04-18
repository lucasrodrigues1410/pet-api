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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UserPresenter } from "../presenters/user.presenter";
import { UpdateUserRequestDto } from "../dtos/update-user.dto";
import { UserResponse } from "../dtos/user.response.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly findUserByIdUseCase: FindUserByIdUseCase,
		private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
	) {}

	@Get("me")
	@ApiOperation({ summary: "Buscar usuário autenticado" })
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		type: UserResponse,
	})
	async getUser(@User("sub") userId: string) {
		const result = await this.findUserByIdUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		const user = result.value.user;
		return UserPresenter.toHTTP(user);
	}

	@Put("edit")
	@ApiOperation({ summary: "Editar usuário autenticado" })
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: "Usuário autenticado editado com sucesso",
	})
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
