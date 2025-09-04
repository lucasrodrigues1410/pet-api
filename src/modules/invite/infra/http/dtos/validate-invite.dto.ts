import { createZodDto } from "nestjs-zod";
import z from "zod";
import { userDto } from "@/modules/user/infra/http/dtos/user.dto";

const validateInviteRequest = z.object({
	token: z.string().min(1, "Token é obrigatório"),
});

const validateInviteResponse = z.object({
	isValid: z.boolean(),
	isExpired: z.boolean(),
	isUsed: z.boolean(),
	invite: z
		.object({
			id: z.string(),
			token: z.string(),
			expiresAt: z.iso.datetime(),
			usedAt: z.iso.datetime().optional(),
			userId: z.string(),
			user: userDto,
		})
		.optional(),
	message: z.string(),
});

export class ValidateInviteRequestDto extends createZodDto(
	validateInviteRequest,
) {}
export class ValidateInviteResponseDto extends createZodDto(
	validateInviteResponse,
) {}
