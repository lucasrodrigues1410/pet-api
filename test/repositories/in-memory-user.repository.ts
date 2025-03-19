import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";

export class InMemoryUserRepository implements UserRepository {
	public items: User[] = [];

	findByEmail(email: string): Promise<User | null> {
		return Promise.resolve(
			this.items.find((user) => user.email === email) || null,
		);
	}
	findById(id: string): Promise<User | null> {
		return Promise.resolve(
			this.items.find((user) => user.id.toString() === id) || null,
		);
	}
	create(user: User): Promise<void> {
		this.items.push(user);
		return Promise.resolve();
	}
}
