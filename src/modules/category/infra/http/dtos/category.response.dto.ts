import { createZodDto } from "nestjs-zod";
import z from "zod";
import { categoryDto } from "./category.dto";

const listResponse = z.object({ items: z.array(categoryDto) });

export class CategoryResponse extends createZodDto(listResponse) {}
