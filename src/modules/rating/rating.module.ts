import { Module } from "@nestjs/common";
import { CreateRatingCompanyUseCase } from "./application/usecases/create-rating.company";
import { RatingRepository } from "./domain/repositories/rating.repository";
import { PrismaRatingRepository } from "./infra/database/repositories/prisma-rating.repository";
import { RatingController } from "./infra/http/controllers/rating.controller";

@Module({
	controllers: [RatingController],
	providers: [
		CreateRatingCompanyUseCase,
		{ provide: RatingRepository, useClass: PrismaRatingRepository },
	],
})
export class RatingModule {}
