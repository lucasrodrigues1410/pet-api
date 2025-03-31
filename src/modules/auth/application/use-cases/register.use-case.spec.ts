import { beforeEach, describe, expect, it } from "bun:test";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { RegisterUseCase } from "./register.use-case";

let inMemoryUsersRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUseCase;

describe("Register", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();

		sut = new RegisterUseCase(inMemoryUsersRepository, fakeHasher);
	});

	it("should register a user", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.items[0],
		});
	});
});
