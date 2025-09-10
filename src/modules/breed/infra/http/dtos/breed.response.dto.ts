import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { breedDto } from "./breed.dto";

const listResponse = z.object({ items: z.array(breedDto) });

export class BreedResponse extends createZodDto(breedDto) {}
export class BreedListResponse extends createZodDto(listResponse) {}
export class BreedListResponseWithPagination extends createZodDto(
	makePaginatedDto(breedDto),
) {}
