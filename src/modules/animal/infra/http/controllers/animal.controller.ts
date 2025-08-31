import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	Logger,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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
import { AnimalPaginatedResponse } from "../dtos/animal.response.dto";
import { CreateAnimalRequestDto } from "../dtos/create-animal.dto";
import { UpdateAnimalRequestDto } from "../dtos/update-animal.dto";

@ApiTags("Animais")
@Controller("animal")
export class AnimalController {
	private readonly logger = new Logger(AnimalController.name);

	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly deleteAnimalUseCase: DeleteAnimalUseCase,
		private readonly updateAnimalUseCase: UpdateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
		private readonly addAssetToAnimalUseCase: AddAssetToAnimalUseCase,
	) {}

	@Post()
	@ApiOperation({ summary: "Cria um animal" })
	@UserTypeDecorator("customer")
	@HttpCode(201)
	async create(
		@User("sub") userId: string,
		@Body() data: CreateAnimalRequestDto,
	) {
		this.logger.log(
			`Creating animal for user ${userId} with name: ${data.name}`,
		);

		try {
			const result = await this.createAnimalUseCase.execute({
				breedId: data.breedId,
				name: data.name,
				weight: data.weight,
				birthdate: data.birthdate,
				userId,
			});

			if (result.isLeft()) {
				if (result.value instanceof ResourceNotFoundError) {
					this.logger.warn(
						`Breed not found for animal creation. User: ${userId}, BreedId: ${data.breedId}`,
					);
					throw new NotFoundException();
				}
				this.logger.error(
					`Failed to create animal for user ${userId}. Error: ${result.value}`,
				);
				throw new BadRequestException();
			}

			this.logger.log(
				`Animal created successfully for user ${userId}. Animal name: ${data.name}`,
			);
		} catch (error) {
			this.logger.error(
				`Unexpected error creating animal for user ${userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	@Get("user/:id")
	@ApiOperation({ summary: "Listar todos os animais de um usuário" })
	@ZodResponse({ status: 200, type: AnimalPaginatedResponse })
	@UserTypeDecorator("customer")
	async listAll(
		@Param("id") userId: string,
		@Query() query: PaginationQueryDto,
	) {
		this.logger.log(
			`Listing animals for user ${userId}. Page: ${query.page}, Limit: ${query.limit}`,
		);

		try {
			const result = await this.listAnimalsFromUserUseCase.execute({
				userId,
				...query,
			});

			if (result.isLeft()) {
				this.logger.error(`Failed to list animals for user ${userId}`);
				throw new BadRequestException();
			}

			this.logger.log(
				`Successfully listed ${result.value.items.length} animals for user ${userId}`,
			);
			return {
				items: result.value.items.map((i) => i.toObject()),
				meta: result.value.meta,
			};
		} catch (error) {
			this.logger.error(
				`Unexpected error listing animals for user ${userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar um animal" })
	@UserTypeDecorator("customer")
	@HttpCode(200)
	async update(
		@User("sub") userId: string,
		@Param("id") animalId: string,
		@Body() data: UpdateAnimalRequestDto,
	) {
		this.logger.log(`Updating animal ${animalId} for user ${userId}`);

		try {
			const result = await this.updateAnimalUseCase.execute({
				userId,
				animalId,
				...data,
			});

			if (result.isLeft()) {
				if (result.value instanceof ResourceNotFoundError) {
					this.logger.warn(
						`Animal not found for update. User: ${userId}, AnimalId: ${animalId}`,
					);
					throw new NotFoundException(result.value.message);
				}
				this.logger.error(
					`Failed to update animal ${animalId} for user ${userId}. Error: ${result.value}`,
				);
				throw new BadRequestException();
			}

			this.logger.log(
				`Animal ${animalId} updated successfully for user ${userId}`,
			);
		} catch (error) {
			this.logger.error(
				`Unexpected error updating animal ${animalId} for user ${userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	@Delete(":id")
	@ApiOperation({ summary: "Deletar um animal" })
	@UserTypeDecorator("customer")
	@HttpCode(204)
	async delete(@User("sub") userId: string, @Param("id") animalId: string) {
		this.logger.log(`Deleting animal ${animalId} for user ${userId}`);

		try {
			const result = await this.deleteAnimalUseCase.execute({
				userId,
				animalId,
			});

			if (result.isLeft()) {
				if (result.value instanceof ResourceNotFoundError) {
					this.logger.warn(
						`Animal not found for deletion. User: ${userId}, AnimalId: ${animalId}`,
					);
					throw new NotFoundException(result.value.message);
				}
				this.logger.error(
					`Failed to delete animal ${animalId} for user ${userId}. Error: ${result.value}`,
				);
				throw new BadRequestException();
			}

			this.logger.log(
				`Animal ${animalId} deleted successfully for user ${userId}`,
			);
		} catch (error) {
			this.logger.error(
				`Unexpected error deleting animal ${animalId} for user ${userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	@Post(":id/asset")
	@ApiOperation({ summary: "Adicionar um asset a um animal" })
	@UserTypeDecorator("customer")
	@HttpCode(201)
	@UseInterceptors(FileInterceptor("file"))
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
		this.logger.log(
			`Adding asset to animal ${animalId} for user ${userId}. File: ${file.originalname}, Size: ${file.size} bytes`,
		);

		try {
			const result = await this.addAssetToAnimalUseCase.execute({
				userId,
				animalId,
				file: file as Express.Multer.File,
			});

			if (result.isLeft()) {
				this.logger.error(
					`Failed to add asset to animal ${animalId} for user ${userId}. Error: ${result.value.message}`,
				);
				throw new BadRequestException();
			}

			this.logger.log(
				`Asset added successfully to animal ${animalId} for user ${userId}`,
			);
		} catch (error) {
			this.logger.error(
				`Unexpected error adding asset to animal ${animalId} for user ${userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
