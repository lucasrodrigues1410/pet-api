import { createZodDto } from "nestjs-zod";
import z from "zod";
import { signInCompanyDto } from "./sign-in-company.dto";

const acceptInviteRequest = z.object({
	token: z.string().min(1, "Token é obrigatório"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const acceptInviteResponse = signInCompanyDto;

export class AcceptInviteRequestDto extends createZodDto(acceptInviteRequest) {}
export class AcceptInviteResponseDto extends createZodDto(acceptInviteResponse) {}
