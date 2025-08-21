import { createZodDto } from "nestjs-zod";
import { UserType } from "prisma/generated/enums";
import { z } from "zod";

export const sessionDto = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	type: z.enum(UserType),
	companyId: z.string().optional(),
	role: z.string().optional(),
});

export class SessionResponseDto extends createZodDto(sessionDto) {}
export type SessionResponse = z.infer<typeof sessionDto>;
