import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CreateServiceUseCase } from "./create-service.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let sut: CreateServiceUseCase;

describe("Create Service", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		sut = new CreateServiceUseCase(inMemoryServicesRepository);
	});

	it("should be able to create a service", async () => {
		const companyId = new UniqueEntityID();
		const serviceData = {
			name: "Grooming Service",
			description: "Professional pet grooming service",
			price: 50.0,
			isActive: true,
			duration: 60,
			companyId: companyId.toString(),
			details: { category: "grooming" },
			priceRange: { min: 30, max: 80 },
		};

		const result = await sut.execute(serviceData);

		expect(result.isRight()).toBe(true);
		expect(result.value?.service.name).toBe(serviceData.name);
		expect(result.value?.service.description).toBe(serviceData.description);
		expect(result.value?.service.price).toBe(serviceData.price);
		expect(result.value?.service.isActive).toBe(serviceData.isActive);
		expect(result.value?.service.duration).toBe(serviceData.duration);
		expect(result.value?.service.companyId.toString()).toBe(
			companyId.toString(),
		);
		expect(result.value?.service.details).toEqual(serviceData.details);
		expect(result.value?.service.priceRange.min).toBe(
			serviceData.priceRange.min,
		);
		expect(result.value?.service.priceRange.max).toBe(
			serviceData.priceRange.max,
		);
	});

	it("should be able to create a service with minimal data", async () => {
		const companyId = new UniqueEntityID();
		const serviceData = {
			name: "Basic Service",
			price: 25.0,
			companyId: companyId.toString(),
		};

		const result = await sut.execute(serviceData);

		expect(result.isRight()).toBe(true);
		expect(result.value?.service.name).toBe(serviceData.name);
		expect(result.value?.service.price).toBe(serviceData.price);
		expect(result.value?.service.isActive).toBe(true); // default value
		expect(result.value?.service.description).toBeNull();
		expect(result.value?.service.duration).toBeNull();
		expect(result.value?.service.details).toEqual({}); // default empty object
		expect(result.value?.service.priceRange.min).toBe(0); // default value
		expect(result.value?.service.priceRange.max).toBe(0); // default value
	});

	it("should create service with custom price range", async () => {
		const companyId = new UniqueEntityID();
		const serviceData = {
			name: "Premium Service",
			price: 100.0,
			companyId: companyId.toString(),
			priceRange: { min: 80, max: 150 },
		};

		const result = await sut.execute(serviceData);

		expect(result.isRight()).toBe(true);
		expect(result.value?.service.priceRange.min).toBe(80);
		expect(result.value?.service.priceRange.max).toBe(150);
	});
});
