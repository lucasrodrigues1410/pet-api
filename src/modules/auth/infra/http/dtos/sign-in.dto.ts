import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const signInRequest = z.object({
	email: z.email(),
	password: z.string().min(5),
});

const signInResponse = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	accessToken: z.jwt(),
	avatar: z.string().optional(),
});

export class SignInRequestDto extends createZodDto(signInRequest) {}
export class SignInResponseDto extends createZodDto(signInResponse) {}
