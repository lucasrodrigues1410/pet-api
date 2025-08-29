import { createZodDto } from "nestjs-zod";
import z from "zod";
import { staffRole } from "@/modules/staff/domain/entities/staff.entity";

const response = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	accessToken: z.jwt(),
	staffRole: z.enum(staffRole),
	companyId: z.string(),
});

export class SignInCompanyResponseDto extends createZodDto(response) {}
