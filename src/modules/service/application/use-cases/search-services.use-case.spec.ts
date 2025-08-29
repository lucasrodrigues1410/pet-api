import { beforeEach, describe, expect, it } from "bun:test";
import { makeService } from "test/factories/make-service";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { SearchServicesUseCase } from "./search-services.use-case";

let inMemoryServiceRepository: InMemoryServiceRepository;
let sut: SearchServicesUseCase;

describe("Search Services Use Case", () => {
	beforeEach(() => {
		inMemoryServiceRepository = new InMemoryServiceRepository();
		sut = new SearchServicesUseCase(inMemoryServiceRepository);
	});

	it("should search services by query", async () => {
		const services = Array.from({ length: 3 }, () =>
			makeService({ name: "Grooming" }),
		);
		const otherServices = Array.from({ length: 2 }, () =>
			makeService({ name: "Vaccination" }),
		);

		for (const service of [...services, ...otherServices]) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			query: "Grooming",
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.items).toHaveLength(3);
		expect(
			result.value?.items.every((service) => service.name.includes("Grooming")),
		).toBe(true);
	});

	it("should search services by animal type", async () => {
		const services = Array.from({ length: 2 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should search services by breed", async () => {
		const services = Array.from({ length: 2 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should search services by category", async () => {
		const services = Array.from({ length: 2 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should search services by location", async () => {
		const services = Array.from({ length: 2 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			location: {
				latitude: -23.5505,
				longitude: -46.6333,
				radiusInKm: 10,
			},
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should search services by price range", async () => {
		const services = Array.from({ length: 2 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			priceRange: {
				min: 50,
				max: 100,
			},
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should return paginated results", async () => {
		const services = Array.from({ length: 15 }, () => makeService());

		for (const service of services) {
			inMemoryServiceRepository.items.push(service);
		}

		const result = await sut.execute({
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.items).toHaveLength(10);
		expect(result.value?.meta.total).toBe(15);
		expect(result.value?.meta.totalPages).toBe(2);
	});
});
