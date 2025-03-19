import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const companyByIdResponse = z.object({
	id: z.string(),
	name: z.string(),
});

export class CompanyByIdResponseDTO extends createZodDto(companyByIdResponse) {}
