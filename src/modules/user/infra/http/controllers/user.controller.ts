import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Put,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UpdateUserProfileUseCase } from "@/modules/user/application/use-cases/update-user-profile.use-case";
import { UpdateUserRequestDto } from "../dtos/update-user.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
	) {}

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
