import { beforeEach, describe, it, expect } from "bun:test";
import { InMemoryPriceVariationRepository } from "test/repositories/in-memory-price-variation.repository";
import { CalculatePriceVariationUseCase } from "./calculate-price-variation.use-case";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { makeAnimal } from "test/factories/make-animal";
import { makePriceVariation } from "test/factories/make-price-variation";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MockPriceStrategyProvider } from "test/providers/price-strategy.provider";

let inMemoryPriceVariationRepository: InMemoryPriceVariationRepository;
let inMemoryAnimalRepository: InMemoryAnimalRepository;
let mockPriceStrategyFactory: MockPriceStrategyProvider;

let sut: CalculatePriceVariationUseCase;

describe("List Animals from User", () => {
	beforeEach(() => {
		inMemoryPriceVariationRepository = new InMemoryPriceVariationRepository();
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
        mockPriceStrategyFactory = new MockPriceStrategyProvider();

		sut = new CalculatePriceVariationUseCase(
			inMemoryAnimalRepository,
			inMemoryPriceVariationRepository,
            mockPriceStrategyFactory
		);
	});

	it("should be able to calculate the price variation", async () => {
		const animal = makeAnimal({
			weight: 11,
		});
		const serviceId = new UniqueEntityID().toString();
		const priceVariations = [
			makePriceVariation({
				serviceId,
				price: 10,
				variation: "SIZE",
				value: "SMALL",
			}),
			makePriceVariation({
				serviceId,
				price: 20,
				variation: "SIZE",
				value: "MEDIUM",
			}),
			makePriceVariation({
				serviceId,
				price: 30,
				variation: "SIZE",
				value: "LARGE",
			}),
		];
		inMemoryPriceVariationRepository.items = priceVariations;
		inMemoryAnimalRepository.items.push(animal);

		const response = await sut.execute({
			animalId: animal.id.toString(),
			serviceId: serviceId,
		});

		expect(response.value).toEqual({
			price: 20,
		});
	});

    it("should return an error if no variation is found", async () => {
        const animal = makeAnimal({
            weight: 27,
        });
        const serviceId = new UniqueEntityID().toString();
        const priceVariations = [
            makePriceVariation({
                serviceId,
                price: 10,
                variation: "SIZE",
                value: "SMALL",
            }),
        ];
        inMemoryPriceVariationRepository.items = priceVariations;
        inMemoryAnimalRepository.items.push(animal);
        const response = await sut.execute({
            animalId: animal.id.toString(),
            serviceId: serviceId,
        });
        expect(response.isLeft()).toBeTruthy();
    });
});
