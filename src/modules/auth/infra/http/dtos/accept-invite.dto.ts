import { createZodDto } from "nestjs-zod";
import z from "zod";
import { signInResponse } from "./sign-in.dto";

const acceptInviteRequest = z.object({
	token: z.string().min(1, "Token é obrigatório"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const acceptInviteResponse = signInResponse;

export class AcceptInviteRequestDto extends createZodDto(acceptInviteRequest) {}
export class AcceptInviteResponseDto extends createZodDto(
	acceptInviteResponse,
) {}
