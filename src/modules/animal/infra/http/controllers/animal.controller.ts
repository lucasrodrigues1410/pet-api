import { DeleteAnimalUseCase } from "@/modules/animal/application/use-cases/delete-animal.use-case";
import { UpdateAnimalUseCase } from "@/modules/animal/application/use-cases/update-animal.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
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
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserTypeDecorator } from "src/modules/auth/infra/http/decorators/user-type.decorator";
import { User } from "src/modules/auth/infra/http/decorators/user.decorator";
import { CreateAnimalUseCase } from "../../../application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../../application/use-cases/list-animals-from-user.use-case";
import {
	CreateAnimalRequestDto,
	CreateAnimalResponseDto,
} from "../dtos/create-animal.dto";
import { ListAnimalsResponseDto } from "../dtos/list-animals.dto";
import { UpdateAnimalRequestDto } from "../dtos/update-animal.dto";

@ApiTags("Animais")
@Controller("animal")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly deleteAnimalUseCase: DeleteAnimalUseCase,
		private readonly updateAnimalUseCase: UpdateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
	) {}

	@ApiOperation({ summary: "Cria um animal" })
	@ApiOkResponse({
		description: "Animal criado com sucesso",
		type: CreateAnimalRequestDto,
	})
	@Post()
	@UserTypeDecorator("CUSTOMER")
	@HttpCode(201)
	async create(
		@User("sub") userId: string,
		@Body() data: CreateAnimalResponseDto,
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

	@ApiOperation({ summary: "Listar todos os animais de um usuário" })
	@ApiOkResponse({
		description: "Animais listados com sucesso",
		type: ListAnimalsResponseDto,
	})
	@Get("user/:id")
	@UserTypeDecorator("CUSTOMER")
	async listAll(@Param("id") userId: string) {
		const result = await this.listAnimalsFromUserUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return {
			results: result.value.animals.map((animal) => ({
				id: animal.id,
				name: animal.name,
				birthdate: animal.birthdate,
				weight: animal.weight,
				breed: {
					name: animal.breed?.name,
				},
				image: animal.asset
					? {
							url: animal.asset?.url,
							thumbnailUrl: animal.asset?.thumbnailUrl,
							width: animal.asset?.width,
							height: animal.asset?.height,
						}
					: undefined,
			})),
		};
	}

	@ApiOperation({ summary: "Atualizar um animal" })
	@ApiOkResponse({
		description: "Animal atualizado com sucesso",
	})
	@Put(":id")
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

	@ApiOperation({ summary: "Deletar um animal" })
	@Delete(":id")
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
}
