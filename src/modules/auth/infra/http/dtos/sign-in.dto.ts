import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { staffRole } from "@/modules/staff/domain/entities/staff.entity";
import { userType } from "@/modules/user/domain/entities/user.entity";

const signInRequest = z.object({
	email: z.email(),
	password: z.string().min(5),
	type: z.enum(userType).optional().default("customer"),
});

export const signInResponse = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	accessToken: z.jwt(),
	avatar: z.string().optional(),
	type: z.enum(userType),
	staffRole: z.enum(staffRole).optional(),
	companyId: z.string().optional(),
});

export class SignInRequestDto extends createZodDto(signInRequest) {}
export class SignInResponseDto extends createZodDto(signInResponse) {}
