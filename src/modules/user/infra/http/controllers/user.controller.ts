import { FileInterceptor } from "@nest-lab/fastify-multer";
import {
	BadRequestException,
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpCode,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Patch,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { AddAssetToUserUseCase } from "@/modules/user/application/use-cases/add-asset-to-user.use-case";
import { ListCompanyClientsUseCase } from "@/modules/user/application/use-cases/list-company-clients.use-case";
import { UpdateUserProfileUseCase } from "@/modules/user/application/use-cases/update-user-profile.use-case";
import {
	ListCompanyClientsQueryDto,
	ListCompanyClientsResponseDto,
} from "../dtos/list-company-clients.dto";
import { UpdateUserRequestDto } from "../dtos/update-user.dto";
import { UploadAvatarDto } from "../dtos/upload-avatar.dto";
import { ClientListPresenter } from "../presenters/client-list.presenter";

@ApiTags("Usuários")
@Controller("users")
export class UserController {
	constructor(
		private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
		private readonly addAssetToUserUseCase: AddAssetToUserUseCase,
		private readonly listCompanyClientsUseCase: ListCompanyClientsUseCase,
	) {}

	@Put("edit")
	@ApiOperation({ summary: "Editar usuário", operationId: "editUser" })
	@HttpCode(204)
	@ApiResponse({ status: 204, description: "Usuário editado com sucesso" })
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

	@Patch("avatar")
	@ApiOperation({
		summary: "Adicionar avatar do usuário",
		operationId: "addAvatar",
	})
	@HttpCode(201)
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({ description: "Envio de imagem", type: UploadAvatarDto })
	async addAvatar(
		@User("sub") userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
					new FileTypeValidator({ fileType: ".(png|jpg|jpeg)" }),
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

	@Get("company/:companyId/clients")
	@ApiOperation({
		summary: "Listar clientes que fizeram agendamentos na empresa",
		operationId: "listCompanyClients",
	})
	@ZodResponse({ status: 200, type: ListCompanyClientsResponseDto })
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	async listCompanyClients(
		@Param("companyId") companyId: string,
		@Query() query: ListCompanyClientsQueryDto,
	) {
		const result = await this.listCompanyClientsUseCase.execute({
			companyId,
			query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return ClientListPresenter.present(result.value.clients);
	}
}
