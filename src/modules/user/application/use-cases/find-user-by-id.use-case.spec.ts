import { beforeEach, describe, expect, it } from "bun:test";
import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { FindUserByIdUseCase } from "./find-user-by-id.use-case";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: FindUserByIdUseCase;

describe("Find a user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		sut = new FindUserByIdUseCase(inMemoryUsersRepository);
	});

	it("should find a user by id", async () => {
		const user = makeUser({});
		inMemoryUsersRepository.create(user);
		const result = await sut.execute({
			userId: user.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			user: expect.objectContaining({
				email: user.email,
				name: user.name,
				password: user.password,
				type: user.type,
			}),
		});
	});
});
