import { PaginationQuerySchema } from "@/shared/utils/pagination-query";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const listBreedsSchema = z.object({
    query: z.string().optional(),
});

export class ListBreedsQueryDto extends createZodDto(listBreedsSchema) {}