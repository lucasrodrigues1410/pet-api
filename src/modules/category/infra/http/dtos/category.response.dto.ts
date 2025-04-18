import { createZodDto } from "@anatine/zod-nestjs";
import { categoryDto } from "./category.dto";

export class CategoryResponse extends createZodDto(categoryDto) {}