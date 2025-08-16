import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const loginRequest = z.object({
	email: z.email(),
	password: z.string().min(5),
});

const loginResponse = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	type: z.literal("CUSTOMER"),
	accessToken: z.jwt(),
});

export class LoginRequestDto extends createZodDto(loginRequest) {}
export class LoginResponseDto extends createZodDto(loginResponse) {}
