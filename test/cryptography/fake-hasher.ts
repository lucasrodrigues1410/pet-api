import { HashComparer } from "src/modules/auth/domain/interfaces/hash-comparer.interface";
import { HashGenerator } from "src/modules/auth/domain/interfaces/hash-generator.interface";

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return plain.concat("-hashed");
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return plain.concat("-hashed") === hash;
	}
}
