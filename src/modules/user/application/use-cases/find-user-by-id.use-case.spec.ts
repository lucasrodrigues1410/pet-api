import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { FindUserByIdUseCase } from "./find-user-by-id.use-case";
import { describe, beforeEach, it, expect } from "vitest";
import { makeUser } from "test/factories/make-user";

let inMemoryUsersRepository: InMemoryUserRepository;
let useCase: FindUserByIdUseCase;

describe("Find a user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		useCase = new FindUserByIdUseCase(inMemoryUsersRepository);
	});

	it("should find a user by id", async () => {
		const user = makeUser({});
		inMemoryUsersRepository.create(user);
		const result = await useCase.execute({
			userId: user.id,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
      user: expect.objectContaining({
        email: user.email,
        name: user.name,
        password: user.password,
        type: user.type,
      })
    })
	});
});
