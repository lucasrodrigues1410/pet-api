import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { CreateAnimalUseCase } from "../../application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "../../application/use-cases/list-animals-from-user.use-case";
import { CreateAnimalDto } from "../dtos/create-animal.dto";
import { User } from "src/modules/auth/presentation/decorators/user.decorator";
import { UserTypeDecorator } from "src/modules/auth/presentation/decorators/user-type.decorator";
import { AnimalDto } from "../dtos/animal.dto";

@ApiTags("Animais")
@Controller("animal")
@UserTypeDecorator("CUSTOMER")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
	) {}

	@ApiOperation({ summary: "Cria um animal" })
	@ApiOkResponse({
		description: "Animal criado com sucesso",
		type: AnimalDto,
	})
	@Post()
	@UserTypeDecorator('CUSTOMER')
	async create(
		@User("sub") userId: number,
		@Body() data: CreateAnimalDto,
	) {
		const result = await this.createAnimalUseCase.execute({
			...data,
			userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

	@ApiOperation({ summary: "Listar todos os animais de um usuário" })
	@ApiOkResponse({
		description: "Animais listados com sucesso",
		type: AnimalDto,
	})
	@Get("user/:id")
	@UserTypeDecorator('CUSTOMER')
	async listAll(@Param("id") userId: number) {
		const result = await this.listAnimalsFromUserUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		const animals = result.value.animals;

		return animals.map((animal) => ({
			id: animal.id,
			name: animal.name,
			age: animal.birthdate
				? new Date().getFullYear() - animal.birthdate.getFullYear()
				: null,
			weight: animal.weight,
			userId: animal.userId,
		}));
	}
}
