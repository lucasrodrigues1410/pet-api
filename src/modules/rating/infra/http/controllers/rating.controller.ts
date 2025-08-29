import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CreateRatingCompanyUseCase } from "@/modules/rating/application/usecases/create-rating.company";
import { CreateRatingRequestDto } from "../dtos/create-rating.dto";

@Controller("ratings")
export class RatingController {
	constructor(
		private readonly createRatingCompanyUseCase: CreateRatingCompanyUseCase,
	) {}

	@Post()
	@UserTypeDecorator("customer")
	@ApiOperation({ summary: "Cria uma avaliação para uma empresa" })
	@ApiResponse({ status: 201, description: "Avaliação criada com sucesso" })
	async create(
		@User("sub") userId: string,
		@Body() body: CreateRatingRequestDto,
	) {
		return this.createRatingCompanyUseCase.execute({
			...body,
			userId,
		});
	}
}
