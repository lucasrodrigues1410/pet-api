import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.use-case";

let inMemoryUsersRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;

let useCase: RegisterUseCase;

describe("Register", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();

		useCase = new RegisterUseCase(inMemoryUsersRepository, fakeHasher);
	});

	it("should register a user", async () => {
		const result = await useCase.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.users[0],
		});
	});
});
