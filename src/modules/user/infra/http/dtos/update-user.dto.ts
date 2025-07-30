import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const updateUserSchema = z.object({
	name: z.string().optional(),
	email: z.email().optional(),
});

export class UpdateUserRequestDto extends createZodDto(updateUserSchema) {}
