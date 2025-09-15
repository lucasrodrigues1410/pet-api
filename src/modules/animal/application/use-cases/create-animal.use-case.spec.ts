import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { subYears } from "date-fns";
import { makeAnimal } from "test/factories/make-animal";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { CreateAnimalUseCase } from "./create-animal.use-case";

describe("Create Animal", () => {
	let moduleRef: any;
	let sut: CreateAnimalUseCase;

	const mockAnimalRepo = {
		create: jest.fn(),
		fetchAllAnimalsByUser: jest.fn(),
	};

	beforeEach(async () => {
		mockAnimalRepo.create.mockReset();
		mockAnimalRepo.fetchAllAnimalsByUser.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateAnimalUseCase,
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
			],
		}).compile();

		sut = moduleRef.get(CreateAnimalUseCase);
	});

	it("should create an animal", async () => {
		const createdAnimal = makeAnimal();
		const params = {
			birthdate: subYears(new Date(), createdAnimal.age ?? 0),
			name: createdAnimal.name,
			weight: createdAnimal.weight ?? 0,
			userId: createdAnimal.userId.toString(),
			breedId: createdAnimal.breedId.toString(),
		};

		mockAnimalRepo.create.mockResolvedValueOnce(createdAnimal);
		mockAnimalRepo.fetchAllAnimalsByUser.mockResolvedValueOnce({
			items: [createdAnimal],
		});

		await sut.execute(params);
		const calledWith = mockAnimalRepo.create.mock.calls[0][0];
		expect(calledWith).toMatchObject(
			expect.objectContaining({
				birthdate: params.birthdate,
				name: params.name,
				weight: params.weight,
				userId: params.userId,
				breedId: params.breedId,
			}),
		);
	});
});
