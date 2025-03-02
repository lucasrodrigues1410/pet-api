import { User } from "../entities/user.entity";

export abstract class IUserRepository {
	abstract findUserByEmail(email: string): Promise<User | null>;
	abstract findById(id: number): Promise<User | null>;
}
