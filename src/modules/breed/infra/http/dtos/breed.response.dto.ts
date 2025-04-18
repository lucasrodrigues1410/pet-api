import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { breedDto } from "./breed.dto";

export class BreedResponse extends createZodDto(breedDto) {}
export class BreedListResponse extends createZodDto(
	z.object({
		items: z.array(breedDto),
	}),
) {}
