import { createZodDto } from "nestjs-zod";
import { categoryDto } from "./category.dto";

export class CategoryResponse extends createZodDto(categoryDto) {}
