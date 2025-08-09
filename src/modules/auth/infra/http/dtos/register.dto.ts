import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const registerRequest = z.object({
	email: z.email(),
	name: z.string(),
	password: z.string().min(5),
});

export class RegisterRequestDto extends createZodDto(registerRequest) {}
