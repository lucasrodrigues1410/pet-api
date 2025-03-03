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
import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
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
	async create(
		@CurrentUser("id") userId: number,
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
	async listAll(@Param("id") userId: number) {
		const result = await this.listAnimalsFromUserUseCase.execute({ userId });
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return result.value;
	}
}
