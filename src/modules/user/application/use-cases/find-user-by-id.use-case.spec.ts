import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { UserRepository } from "../../domain/repositories/user.repository";
import { FindUserByIdUseCase } from "./find-user-by-id.use-case";

let sut: FindUserByIdUseCase;
let moduleRef: any;

const mockUserRepository = {
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

describe("Find a user", () => {
	beforeEach(async () => {
		mockUserRepository.findById.mockReset();
		mockUserRepository.create.mockReset();
		mockUserRepository.update.mockReset();
		mockUserRepository.delete.mockReset();
		moduleRef = await Test.createTestingModule({
			providers: [
				FindUserByIdUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
			],
		}).compile();
		sut = moduleRef.get(FindUserByIdUseCase);
	});

	it("should find a user by id", async () => {
		const user = makeUser({});
		mockUserRepository.findById.mockResolvedValue(user);
		const result = await sut.execute({ userId: user.id.toString() });

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
