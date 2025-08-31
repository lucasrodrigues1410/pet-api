import {
	BadRequestException,
	Body,
	Controller,
	FileTypeValidator,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { AddAssetToUserUseCase } from "@/modules/user/application/use-cases/add-asset-to-user.use-case";
import { UpdateUserProfileUseCase } from "@/modules/user/application/use-cases/update-user-profile.use-case";
import { UpdateUserRequestDto } from "../dtos/update-user.dto";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
		private readonly addAssetToUserUseCase: AddAssetToUserUseCase,
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

	@Post("avatar")
	@ApiOperation({ summary: "Adicionar avatar do usuário" })
	@HttpCode(201)
	@UseInterceptors(FileInterceptor("file"))
	async addAvatar(
		@User("sub") userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 2,
					}),
					new FileTypeValidator({
						fileType: ".(png|jpg|jpeg)",
					}),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const result = await this.addAssetToUserUseCase.execute({
			userId,
			file: file as Express.Multer.File,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
