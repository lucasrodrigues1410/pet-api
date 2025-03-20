import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
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
}
