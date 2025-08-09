import { createZodDto } from "nestjs-zod";
import { PaginatedDto } from "@/shared/utils/pagination";
import { animalDto } from "./animal.dto";

export class AnimalResponse extends createZodDto(animalDto) {}
export class AnimalPaginatedResponse extends createZodDto(PaginatedDto(animalDto)) {}
