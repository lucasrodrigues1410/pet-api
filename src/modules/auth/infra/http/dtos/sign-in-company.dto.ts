import { createZodDto } from "nestjs-zod";
import z from "zod";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";

const response = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	type: z.literal("COMPANY"),
	accessToken: z.jwt(),
	staffRole: z.enum(StaffRole),
	companyId: z.string(),
});

export class SignInCompanyResponseDto extends createZodDto(response) {}
