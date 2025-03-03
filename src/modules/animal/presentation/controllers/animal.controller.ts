import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { CreateAnimalUseCase } from "../../application/use-cases/create-animal.use-case";
import { UpdateAnimalUseCase } from "../../application/use-cases/update-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../application/use-cases/list-animals-from-user.use-case";
import { CreateAnimalDto } from "../dtos/create-animal.dto";
import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
import { UpdateAnimalDto } from "../dtos/update-animal.dto";
import { UserTypeDecorator } from "src/modules/auth/presentation/decorators/user-type.decorator";
import { AnimalDto } from "../dtos/animal.dto";
import { CreateAnimalResponseDto } from "../dtos/create-animal-response.dto";

@ApiTags("Animais")
@Controller("animal")
@UserTypeDecorator("CUSTOMER")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly updateAnimalUseCase: UpdateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
	) {}

	@ApiOperation({ summary: "Cria um animal" })
	@ApiOkResponse({
		description: "Animal criado com sucesso",
		type: CreateAnimalResponseDto,
	})
	@ApiResponse({ status: 400, description: "Erro de validação" })
	@Post()
	async create(
		@CurrentUser("id") userId: number,
		@Body() data: CreateAnimalDto,
	) {
		return this.createAnimalUseCase.execute({
			...data,
			userId,
		});
	}

	@ApiOperation({ summary: "Atualiza um animal" })
	@ApiOkResponse({ description: "Animal atualizado com sucesso" })
	@ApiNotFoundResponse({ description: "Animal não encontrado" })
	@Put(":id")
	async update(
		@CurrentUser("id") userId: number,
		@Param("id") animalId: number,
		@Body() data: UpdateAnimalDto,
	) {
		return this.updateAnimalUseCase.execute(animalId, userId, data);
	}

	@ApiOperation({ summary: "Listar todos os animais de um usuário" })
	@ApiOkResponse({
		description: "Animais listados com sucesso",
		type: AnimalDto,
	})
	@Get("user/:id")
	async listAll(@Param("id") userId: number) {
		return this.listAnimalsFromUserUseCase.execute(userId);
	}
}
