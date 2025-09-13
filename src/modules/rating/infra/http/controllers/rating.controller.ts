import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CreateRatingCompanyUseCase } from "@/modules/rating/application/usecases/create-rating.company";
import { GetCompanyRatingStatsUseCase } from "@/modules/rating/application/usecases/get-company-rating-stats.use-case";
import { ListCompanyRatingsUseCase } from "@/modules/rating/application/usecases/list-company-ratings.use-case";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CreateRatingRequestDto } from "../dtos/create-rating.dto";
import {
	CompanyRatingStatsResponse,
	RatingListResponse,
} from "../dtos/rating.response.dto";
import { RatingListPresenter } from "../presenters/rating-list.presenter";

@ApiTags("Avaliações")
@Controller("ratings")
export class RatingController {
	constructor(
		private readonly createRatingCompanyUseCase: CreateRatingCompanyUseCase,
		private readonly listCompanyRatingsUseCase: ListCompanyRatingsUseCase,
		private readonly getCompanyRatingStatsUseCase: GetCompanyRatingStatsUseCase,
	) {}

	@Post()
	@UserTypeDecorator("customer")
	@ApiOperation({
		summary: "Cria uma avaliação para uma empresa",
		operationId: "createRating",
	})
	@ApiResponse({ status: 201, description: "Avaliação criada com sucesso" })
	async create(
		@User("sub") userId: string,
		@Body() body: CreateRatingRequestDto,
	) {
		return this.createRatingCompanyUseCase.execute({ ...body, userId });
	}

	@Get("company/:companyId")
	@Public()
	@ApiOperation({
		summary: "Listar avaliações de uma empresa",
		operationId: "listCompanyRatings",
	})
	@ZodResponse({ status: 200, type: RatingListResponse })
	async listByCompany(
		@Param("companyId") companyId: string,
		@Query() query: PaginationQueryDto,
	): Promise<RatingListResponse> {
		const result = await this.listCompanyRatingsUseCase.execute({
			companyId,
			...query,
		});

		if (result.isLeft()) {
			throw new NotFoundException("Empresa não encontrada");
		}
		return RatingListPresenter.present(result.value);
	}

	@Get("company/:companyId/stats")
	@Public()
	@ApiOperation({
		summary: "Obter estatísticas das avaliações de uma empresa",
		operationId: "getCompanyRatingStats",
	})
	@ZodResponse({ status: 200, type: CompanyRatingStatsResponse })
	async getCompanyStats(
		@Param("companyId") companyId: string,
	): Promise<CompanyRatingStatsResponse> {
		const result = await this.getCompanyRatingStatsUseCase.execute({
			companyId,
		});

		if (result.isLeft()) {
			throw new NotFoundException("Empresa não encontrada");
		}

		return result.value;
	}
}
