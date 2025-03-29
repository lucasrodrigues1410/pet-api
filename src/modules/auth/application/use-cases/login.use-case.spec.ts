import { beforeEach, describe, it, expect } from 'bun:test';
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { LoginUseCase } from "./login.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: LoginUseCase;

describe("Login", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();
		encrypter = new FakeEncrypter();

		sut = new LoginUseCase(inMemoryUserRepository, fakeHasher, encrypter);
	});

	it("should login", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
		});
		inMemoryUserRepository.items.push(user);
		const result = await sut.execute({
			email: user.email,
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
