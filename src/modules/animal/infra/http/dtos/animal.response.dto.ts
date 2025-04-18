import { createZodDto } from "@anatine/zod-nestjs";
import { animalDto } from "./animal.dto";
import { PaginatedDto } from "@/core/infra/dtos/pagination.dto";

export class AnimalResponse extends createZodDto(animalDto) {}
export class AnimalPaginatedResponse extends createZodDto(PaginatedDto(animalDto)) {}
