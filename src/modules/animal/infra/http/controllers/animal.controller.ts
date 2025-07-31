import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Post,
	Put,
	Query,
	UploadedFile,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { AddAssetToAnimalUseCase } from "@/modules/animal/application/use-cases/add-asset-to-animal.use-case";
import { DeleteAnimalUseCase } from "@/modules/animal/application/use-cases/delete-animal.use-case";
import { UpdateAnimalUseCase } from "@/modules/animal/application/use-cases/update-animal.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CreateAnimalUseCase } from "../../../application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../../application/use-cases/list-animals-from-user.use-case";
import { AnimalPaginatedResponse } from "../dtos/animal.response.dto";
import { CreateAnimalRequestDto } from "../dtos/create-animal.dto";
import { UpdateAnimalRequestDto } from "../dtos/update-animal.dto";
import { AnimalPresenter } from "../presenters/animal.presenter";

@ApiTags("Animais")
@Controller("animal")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly deleteAnimalUseCase: DeleteAnimalUseCase,
		private readonly updateAnimalUseCase: UpdateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
		private readonly addAssetToAnimalUseCase: AddAssetToAnimalUseCase,
	) {}

	@Post()
	@ApiOperation({ summary: "Cria um animal" })
	@UserTypeDecorator("CUSTOMER")
	@HttpCode(201)
	async create(
		@User("sub") userId: string,
		@Body() data: CreateAnimalRequestDto,
	) {
		const result = await this.createAnimalUseCase.execute({
			...data,
			userId,
		});

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException();
			}
			throw new BadRequestException();
		}
	}

	@Get("user/:id")
	@ApiOperation({ summary: "Listar todos os animais de um usuário" })
	@ApiResponse({ status: 200, type: AnimalPaginatedResponse })
	@UserTypeDecorator("CUSTOMER")
	async listAll(
		@Param("id") userId: string,
		@Query() query: PaginationQueryDto,
	) {
		const result = await this.listAnimalsFromUserUseCase.execute({
			userId,
			...query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return PaginationPresenter.toHTTP({
			items: result.value.items.map(AnimalPresenter.toHTTP),
			meta: result.value.meta,
		});
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar um animal" })
	@UserTypeDecorator("CUSTOMER")
	@HttpCode(200)
	async update(
		@User("sub") userId: string,
		@Param("id") animalId: string,
		@Body() data: UpdateAnimalRequestDto,
	) {
		const result = await this.updateAnimalUseCase.execute({
			userId,
			animalId,
			...data,
		});

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException(result.value.message);
			}
			throw new BadRequestException();
		}
	}

	@Delete(":id")
	@ApiOperation({ summary: "Deletar um animal" })
	@UserTypeDecorator("CUSTOMER")
	@HttpCode(204)
	async delete(@User("sub") userId: string, @Param("id") animalId: string) {
		const result = await this.deleteAnimalUseCase.execute({
			userId,
			animalId,
		});

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException(result.value.message);
			}
			throw new BadRequestException();
		}
	}

	@Post(":id/asset")
	@ApiOperation({ summary: "Adicionar um asset a um animal" })
	@UserTypeDecorator("CUSTOMER")
	@HttpCode(201)
	async addAsset(
		@User("sub") userId: string,
		@Param("id") animalId: string,
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
		const result = await this.addAssetToAnimalUseCase.execute({
			userId,
			animalId,
			file: file as Express.Multer.File,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
