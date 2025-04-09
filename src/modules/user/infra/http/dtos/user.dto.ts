import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const user = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	type: z.enum(["CUSTOMER", "ADMIN", "COMPANY"]),
});

export class UserResponseDto extends createZodDto(user) {}
