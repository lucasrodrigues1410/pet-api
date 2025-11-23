import { z } from "zod";
import { User } from "../../../domain/entities/user.entity";
import { userDto } from "../dtos/user.dto";

export class UserPresenter {
	static toHTTP(user: User): z.infer<typeof userDto> {
		return { id: user.id.toString(), email: user.email, name: user.name };
	}
}
