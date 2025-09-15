import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { userType } from "@/modules/user/domain/entities/user.entity";

export const sessionDto = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	type: z.enum(userType),
	companyId: z.string().optional(),
	role: z.string().optional(),
	avatar: z.string().optional(),
});

export class SessionResponseDto extends createZodDto(sessionDto) {}
export type SessionResponse = z.infer<typeof sessionDto>;
