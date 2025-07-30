import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { PaginatedDto } from "@/shared/utils/pagination";
import { breedDto } from "./breed.dto";

export class BreedResponse extends createZodDto(breedDto) {}
export class BreedListResponse extends createZodDto(
	z.object({
		items: z.array(breedDto),
	}),
) {}
export class BreedListResponseWithPagination extends createZodDto(
	PaginatedDto(breedDto),
) {}
