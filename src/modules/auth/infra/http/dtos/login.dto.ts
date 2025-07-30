import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const loginRequest = z.object({
	email: z.email(),
	password: z.string().min(5),
});

const loginResponse = z.object({
	access_token: z.string(),
});

export class LoginRequestDto extends createZodDto(loginRequest) {}
export class LoginResponseDto extends createZodDto(loginResponse) {}
