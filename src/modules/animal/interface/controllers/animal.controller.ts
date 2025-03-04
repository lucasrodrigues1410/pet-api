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
import { User } from "src/modules/auth/interface/decorators/user.decorator";
import { UserTypeDecorator } from "src/modules/auth/interface/decorators/user-type.decorator";
import { CreateAnimalResponseDto } from "../dtos/create-animal-response.dto";

@ApiTags("Animais")
@Controller("animal")
export class AnimalController {
	constructor(
		private readonly createAnimalUseCase: CreateAnimalUseCase,
		private readonly listAnimalsFromUserUseCase: ListAnimalsFromUserUserUseCase,
	) {}

	@ApiOperation({ summary: "Cria um animal" })
	@ApiOkResponse({
		description: "Animal criado com sucesso",
		type: CreateAnimalResponseDto,
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
		type: CreateAnimalResponseDto,
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
			breed: {
				name: animal.breed?.name,
			},
		}));
	}
}
