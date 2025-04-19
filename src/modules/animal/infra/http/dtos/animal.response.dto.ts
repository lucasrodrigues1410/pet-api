import { PaginatedDto } from "@/core/infra/dtos/pagination.dto";
import { createZodDto } from "@anatine/zod-nestjs";
import { animalDto } from "./animal.dto";

export class AnimalResponse extends createZodDto(animalDto) {}
export class AnimalPaginatedResponse extends createZodDto(
	PaginatedDto(animalDto),
) {}
