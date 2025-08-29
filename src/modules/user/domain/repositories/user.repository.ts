import { Asset } from "@/modules/asset/domain/entities/asset";
import { User } from "../entities/user.entity";

export abstract class UserRepository {
	abstract findByEmail(
		email: string,
	): Promise<(User & { avatar?: Asset }) | null>;
	abstract findById(id: string): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(user: User): Promise<void>;
}
