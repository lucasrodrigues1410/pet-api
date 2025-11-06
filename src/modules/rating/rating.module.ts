import { Module } from "@nestjs/common";
import { CompanyModule } from "../company/company.module";
import { CheckRatingEligibilityUseCase } from "./application/usecases/check-rating-eligibility.use-case";
import { CreateRatingCompanyUseCase } from "./application/usecases/create-rating.company.use-case";
import { GetCompanyRatingStatsUseCase } from "./application/usecases/get-company-rating-stats.use-case";
import { ListCompanyRatingsUseCase } from "./application/usecases/list-company-ratings.use-case";
import { RatingRepository } from "./domain/repositories/rating.repository";
import { PrismaRatingRepository } from "./infra/database/repositories/prisma-rating.repository";
import { RatingController } from "./infra/http/controllers/rating.controller";

@Module({
	imports: [CompanyModule],
	controllers: [RatingController],
	providers: [
		CreateRatingCompanyUseCase,
		ListCompanyRatingsUseCase,
		GetCompanyRatingStatsUseCase,
		CheckRatingEligibilityUseCase,
		{ provide: RatingRepository, useClass: PrismaRatingRepository },
	],
})
export class RatingModule {}
