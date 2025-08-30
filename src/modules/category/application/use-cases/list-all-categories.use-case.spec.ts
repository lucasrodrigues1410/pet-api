import { beforeEach, describe, expect, it } from "bun:test";
import { makeCategory } from "test/factories/make-category";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category.repository";
import { ListAllCategoriesUseCase } from "./list-all-categories.use-case";

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let sut: ListAllCategoriesUseCase;

describe("List All Categories Use Case", () => {
	beforeEach(() => {
		inMemoryCategoryRepository = new InMemoryCategoryRepository();
		sut = new ListAllCategoriesUseCase(inMemoryCategoryRepository);
	});

	it("should list all categories ordered by name", async () => {
		// Arrange
		const category1 = makeCategory({ name: "Veterinária" });
		const category2 = makeCategory({ name: "Banho e Tosa" });
		const category3 = makeCategory({ name: "Adestramento" });

		inMemoryCategoryRepository.items = [category1, category2, category3];

		// Act
		const result = await sut.execute();

		// Assert
		expect(result).toHaveLength(3);
		expect(result[0].name).toBe("Adestramento");
		expect(result[1].name).toBe("Banho e Tosa");
		expect(result[2].name).toBe("Veterinária");
	});

	it("should return empty array when no categories exist", async () => {
		// Arrange
		inMemoryCategoryRepository.items = [];

		// Act
		const result = await sut.execute();

		// Assert
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	it("should return single category when only one exists", async () => {
		// Arrange
		const category = makeCategory({
			name: "Pet Shop",
			description: "Categoria para produtos de pet shop",
		});
		inMemoryCategoryRepository.items = [category];

		// Act
		const result = await sut.execute();

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Pet Shop");
		expect(result[0].description).toBe("Categoria para produtos de pet shop");
		expect(result[0].type).toBe("petshop");
	});

	it("should maintain category properties correctly", async () => {
		// Arrange
		const category = makeCategory({
			name: "Serviços Médicos",
			type: "petshop",
			description: "Serviços veterinários e médicos",
		});
		inMemoryCategoryRepository.items = [category];

		// Act
		const result = await sut.execute();

		// Assert
		expect(result[0]).toEqual(category);
		expect(result[0].id).toBe(category.id);
		expect(result[0].name).toBe("Serviços Médicos");
		expect(result[0].type).toBe("petshop");
		expect(result[0].description).toBe("Serviços veterinários e médicos");
	});
});
