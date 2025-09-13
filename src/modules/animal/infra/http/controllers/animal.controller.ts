import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { AddAssetToAnimalUseCase } from "@/modules/animal/application/use-cases/add-asset-to-animal.use-case";
import { DeleteAnimalUseCase } from "@/modules/animal/application/use-cases/delete-animal.use-case";
import { GetAnimalByIdUseCase } from "@/modules/animal/application/use-cases/get-animal-by-id.use-case";
import { UpdateAnimalUseCase } from "@/modules/animal/application/use-cases/update-animal.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CreateAnimalUseCase } from "../../../application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../../application/use-cases/list-animals-from-user.use-case";
import {
	CreateAnimalRequestDto,
	CreateAnimalResponseDto,
} from "../dtos/create-animal.dto";
import { GetAnimalByIdResponseDto } from "../dtos/get-animal-by-id.dto";
import { ListAnimalFromUserResponseDto } from "../dtos/list-animal-from-user.dto";
import { UpdateAnimalRequestDto } from "../dtos/update-animal.dto";
import { UploadAnimalImageDto } from "../dtos/upload-animal-image.dto";
import { GetAnimalByIdPresenter } from "../presenters/get-animal-by-id.presenter";
import { ListAnimalsFromUserPresenter } from "../presenters/list-animals-from-user.presenter";

@ApiTags("Animais")
@Controller("animals")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly deleteAnimalUseCase: DeleteAnimalUseCase,
		private readonly getAnimalByIdUseCase: GetAnimalByIdUseCase,
		private readonly updateAnimalUseCase: UpdateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
		private readonly addAssetToAnimalUseCase: AddAssetToAnimalUseCase,
	) {}

	@Post()
	@ApiOperation({ summary: "Cria um animal", operationId: "createAnimal" })
	@UserTypeDecorator("customer")
	@ZodResponse({ status: 201, type: CreateAnimalResponseDto })
	@HttpCode(201)
	async create(
		@User("sub") userId: string,
		@Body() data: CreateAnimalRequestDto,
	) {
		const result = await this.createAnimalUseCase.execute({ ...data, userId });

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException();
			}
			throw new BadRequestException();
		}

		return { id: result.value.animal.id.toString() };
	}

	@Get("user/:id")
	@ApiOperation({
		summary: "Listar todos os animais de um usuário",
		operationId: "listAnimalsFromUser",
	})
	@ZodResponse({ status: 200, type: ListAnimalFromUserResponseDto })
	@UserTypeDecorator("customer")
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

		return ListAnimalsFromUserPresenter.present(result.value);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Buscar animal por ID",
		operationId: "getAnimalById",
	})
	@ZodResponse({ status: 200, type: GetAnimalByIdResponseDto })
	@UserTypeDecorator("customer")
	async getById(@User("sub") userId: string, @Param("id") animalId: string) {
		const result = await this.getAnimalByIdUseCase.execute({
			userId,
			animalId,
		});

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException();
			}
			throw new BadRequestException();
		}

		return GetAnimalByIdPresenter.present(result.value.animal as any);
	}

	@Post(":id/asset")
	@ApiOperation({
		summary: "Adicionar um asset a um animal",
		operationId: "addAssetToAnimal",
	})
	@UserTypeDecorator("customer")
	@HttpCode(201)
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({ description: "Envio de imagem", type: UploadAnimalImageDto })
	async addAsset(
		@User("sub") userId: string,
		@Param("id") animalId: string,
		@UploadedFile() file: Express.Multer.File,
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

	@Put(":id")
	@ApiOperation({ summary: "Atualizar um animal", operationId: "updateAnimal" })
	@UserTypeDecorator("customer")
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
	@ApiOperation({ summary: "Deletar um animal", operationId: "deleteAnimal" })
	@UserTypeDecorator("customer")
	@HttpCode(204)
	async delete(@User("sub") userId: string, @Param("id") animalId: string) {
		const result = await this.deleteAnimalUseCase.execute({ userId, animalId });

		if (result.isLeft()) {
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException(result.value.message);
			}
			throw new BadRequestException();
		}
	}
}
