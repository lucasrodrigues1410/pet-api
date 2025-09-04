import { createZodDto } from "nestjs-zod";
import z from "zod";
import { staffRole } from "@/modules/staff/domain/entities/staff.entity";

export const signInCompanyDto = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	accessToken: z.jwt(),
	staffRole: z.enum(staffRole),
	companyId: z.string(),
	avatar: z.string().optional(),
});

export class SignInCompanyResponseDto extends createZodDto(signInCompanyDto) {}
