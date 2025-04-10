import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UpdateUserProfileUseCase } from "./update-user-profile.use-case";
import { beforeEach, describe, expect, it } from "bun:test";
import { makeUser } from "test/factories/make-user";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

let userRepository: InMemoryUserRepository;

let sut: UpdateUserProfileUseCase;

describe("UpdateUserProfileUseCase", () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        sut = new UpdateUserProfileUseCase(userRepository);
    });

    it("should be able to update user profile", async () => {

        const user = makeUser();
        userRepository.items.push(user);

        const updatedUser = {
            name: "Updated Name",
            email: "updated@gmail.com"
        }

        const result = await sut.execute({
            userId: user.id.toString(),
            profileData: {
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });
        expect(result.isRight()).toBeTruthy();
        expect(userRepository.items[0].name).toEqual(updatedUser.name);
        expect(userRepository.items[0].email).toEqual(updatedUser.email);
    });

    it("should not be able to update user profile with invalid id", async () => {

        const result = await sut.execute({
            userId: 'invalid-id',
            profileData: {},
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not update the profile if the user being edited is not the same as the one in the database", async () => {

        const user = makeUser();
        userRepository.items.push(user);

        const result = await sut.execute({
            userId: "different-id",
            profileData: {
                name: "Another Name",
                email: "another@gmail.com"
            },
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
        expect(userRepository.items[0].name).not.toEqual("Another Name");
        expect(userRepository.items[0].email).not.toEqual("another@gmail.com");
    });

})