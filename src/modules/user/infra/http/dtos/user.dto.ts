import { z } from "zod";
import { userType } from "@/modules/user/domain/entities/user.entity";

export const userDto = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	type: z.enum(userType),
});
