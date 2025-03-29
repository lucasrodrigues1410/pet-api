import { Injectable } from "@nestjs/common";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
	hash(plain: string): Promise<string> {
		return Bun.password.hash(plain);
	}

	compare(plain: string, hash: string): Promise<boolean> {
		return Bun.password.verify(plain, hash);
	}
}
