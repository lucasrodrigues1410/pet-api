import { createZodDto } from "nestjs-zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import {
	companyRatingStatsDto,
	ratingDto,
	ratingEligibilityDto,
} from "./rating.dto";

export class RatingResponse extends createZodDto(ratingDto) {}
export class RatingListResponse extends createZodDto(
	makePaginatedDto(ratingDto),
) {}
export class CompanyRatingStatsResponse extends createZodDto(
	companyRatingStatsDto,
) {}
export class RatingEligibilityResponse extends createZodDto(
	ratingEligibilityDto,
) {}
