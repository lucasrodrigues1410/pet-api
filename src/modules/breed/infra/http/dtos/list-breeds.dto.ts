import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const listBreedsSchema = z.object({ query: z.string().optional() });

export class ListBreedsQueryDto extends createZodDto(listBreedsSchema) {}
