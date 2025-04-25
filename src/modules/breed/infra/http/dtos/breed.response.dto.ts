import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { breedDto } from "./breed.dto";
import { PaginatedDto } from "@/shared/utils/pagination";

export class BreedResponse extends createZodDto(breedDto) {}
export class BreedListResponse extends createZodDto(
	z.object({
		items: z.array(breedDto),
	}),
) {}
export class BreedListResponseWithPagination extends createZodDto(PaginatedDto(breedDto)) {}