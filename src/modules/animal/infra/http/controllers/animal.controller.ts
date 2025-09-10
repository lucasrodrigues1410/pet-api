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
import { UpdateAnimalUseCase } from "@/modules/animal/application/use-cases/update-animal.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CreateAnimalUseCase } from "../../../application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../../application/use-cases/list-animals-from-user.use-case";
import {
	CreateAnimalRequestDto,
	CreateAnimalResponseDto,
} from "../dtos/create-animal.dto";
import { ListAnimalFromUserResponseDto } from "../dtos/list-animal-from-user.dto";
import { UpdateAnimalRequestDto } from "../dtos/update-animal.dto";
import { UploadAnimalImageDto } from "../dtos/upload-animal-image.dto";

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
	@ApiOperation({ summary: "Cria um animal", operationId: "createAnimal" })
	@UserTypeDecorator("customer")
	@ZodResponse({ status: 201, type: CreateAnimalResponseDto })
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

		return {
			items: result.value.items.map((i) => {
				return {
					...i.toObject(),
					breed: i.breed.toObject(),
					asset: i.asset?.toObject(),
				};
			}),
			meta: result.value.meta,
		};
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
