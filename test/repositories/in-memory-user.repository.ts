import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find(user => user.email === email) || null);
  }
  findById(id: number): Promise<User | null> {
    return Promise.resolve(this.users.find(user => user.id === id) || null);
  }
  create(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }
}