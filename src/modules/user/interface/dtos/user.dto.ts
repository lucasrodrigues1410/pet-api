import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const user = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	type: z.enum(["CUSTOMER", "ADMIN", "COMPANY"]),
});

export class UserResponseDto extends createZodDto(user) {}
