import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserProfileUseCase } from "./update-user-profile.use-case";

let sut: UpdateUserProfileUseCase;
let moduleRef: any;

const mockUserRepository = {
	findById: jest.fn(),
	update: jest.fn(),
	create: jest.fn(),
	delete: jest.fn(),
};

describe("UpdateUserProfileUseCase", () => {
	beforeEach(async () => {
		mockUserRepository.findById.mockReset();
		mockUserRepository.update.mockReset();
		mockUserRepository.create.mockReset();
		mockUserRepository.delete.mockReset();
		moduleRef = await Test.createTestingModule({
			providers: [
				UpdateUserProfileUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
			],
		}).compile();
		sut = moduleRef.get(UpdateUserProfileUseCase);
	});

	it("should be able to update user profile", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);

		const updatedUser = { name: "Updated Name", email: "updated@gmail.com" };

		const result = await sut.execute({
			userId: user.id.toString(),
			profileData: { name: updatedUser.name, email: updatedUser.email },
		});
		expect(result.isRight()).toBeTruthy();
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
	});

	it("should not be able to update user profile with invalid id", async () => {
		mockUserRepository.findById.mockResolvedValue(null);
		const result = await sut.execute({ userId: "invalid-id", profileData: {} });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not update the profile if the user being edited is not the same as the one in the database", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);

		const result = await sut.execute({
			userId: "different-id",
			profileData: { name: "Another Name", email: "another@gmail.com" },
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockUserRepository.update).not.toHaveBeenCalled();
	});
});
