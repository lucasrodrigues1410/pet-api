import { Encrypter } from "src/modules/auth/domain/interfaces/encrypter.interface";

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return JSON.stringify(payload);
	}
}
