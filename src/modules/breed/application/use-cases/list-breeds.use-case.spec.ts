import { makeBreed } from "test/factories/make-breed";
import { InMemoryBreedRepository } from "test/repositories/in-memory-breed.repository";
import { ListBreedsUseCase } from "./list-breeds.use-case";

let inMemoryCompaniesRepository: InMemoryBreedRepository;
let useCase: ListBreedsUseCase;

describe("List Breeds", () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryBreedRepository();
		useCase = new ListBreedsUseCase(inMemoryCompaniesRepository);
	});

	it("should get a breeds", async () => {
		const breeds = Array.from({ length: 5 }, () => makeBreed());

		for (const breed of breeds) {
			inMemoryCompaniesRepository.create(breed);
		}
		const result = await useCase.execute();

		expect(result.isRight()).toBe(true);
		expect(result.value?.breeds).toHaveLength(5);
	});
});
