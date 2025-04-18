import { createZodDto } from "@anatine/zod-nestjs";
import { breedDto } from "./breed.dto";
import { z } from "zod";

export class BreedResponse extends createZodDto(breedDto) {}
export class BreedListResponse extends createZodDto(
	z.object({
		items: z.array(breedDto),
	}),
) {}
