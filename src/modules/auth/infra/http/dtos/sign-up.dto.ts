import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const signUpRequest = z.object({
	email: z.email(),
	name: z.string(),
	password: z.string().min(5),
});

export class SignUpRequestDto extends createZodDto(signUpRequest) {}
