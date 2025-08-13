import { beforeEach, describe, expect, it } from "bun:test";
import { makeService } from "test/factories/make-service";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UpdateServiceUseCase } from "./update-service.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let sut: UpdateServiceUseCase;

describe("Update Service", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		sut = new UpdateServiceUseCase(inMemoryServicesRepository);
	});

	it("should be able to update a service", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId });
		await inMemoryServicesRepository.create(service);

		const updateData = {
			id: service.id.toString(),
			companyId: companyId.toString(),
			name: "Updated Service Name",
			description: "Updated description",
			price: 75.0,
			duration: 90,
		};

		const result = await sut.execute(updateData);

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const updatedService = inMemoryServicesRepository.items[0];
			expect(updatedService?.name).toBe(updateData.name);
			expect(updatedService?.description).toBe(updateData.description);
			expect(updatedService?.price).toBe(updateData.price);
			expect(updatedService?.duration).toBe(updateData.duration);
			expect(updatedService?.companyId.toString()).toBe(companyId.toString());
		}
	});

	it("should be able to update only specific fields", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId });
		await inMemoryServicesRepository.create(service);

		const originalName = service.name;
		const originalPrice = service.price;

		const updateData = {
			id: service.id.toString(),
			companyId: companyId.toString(),
			description: "Only description updated",
		};

		const result = await sut.execute(updateData);

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const updatedService = inMemoryServicesRepository.items[0];
			expect(updatedService?.name).toBe(originalName); // unchanged
			expect(updatedService?.price).toBe(originalPrice); // unchanged
			expect(updatedService?.description).toBe(updateData.description); // updated
		}
	});

	it("should be able to update price range", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId });
		await inMemoryServicesRepository.create(service);

		const updateData = {
			id: service.id.toString(),
			companyId: companyId.toString(),
			priceRange: { min: 40, max: 120 },
		};

		const result = await sut.execute(updateData);

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const updatedService = inMemoryServicesRepository.items[0];
			expect(updatedService?.priceRange.min).toBe(40);
			expect(updatedService?.priceRange.max).toBe(120);
		}
	});

	it("should be able to update isActive status", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, isActive: true });
		await inMemoryServicesRepository.create(service);

		const updateData = {
			id: service.id.toString(),
			companyId: companyId.toString(),
			isActive: false,
		};

		const result = await sut.execute(updateData);

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const updatedService = inMemoryServicesRepository.items[0];
			expect(updatedService?.isActive).toBe(false);
		}
	});

	it("should return error when service not found", async () => {
		const updateData = {
			id: "non-existent-id",
			companyId: "non-existent-company-id",
			name: "Updated Name",
		};

		const result = await sut.execute(updateData);

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Recurso não encontrado");
		}
	});

	it("should preserve existing data when updating partial fields", async () => {
		const companyId = new UniqueEntityID();
		const originalDetails = { category: "grooming", type: "basic" };
		const service = makeService({
			companyId,
			details: originalDetails,
			duration: 45,
		});
		await inMemoryServicesRepository.create(service);

		const updateData = {
			id: service.id.toString(),
			companyId: companyId.toString(),
			name: "New Name Only",
		};

		const result = await sut.execute(updateData);

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const updatedService = inMemoryServicesRepository.items[0];
			expect(updatedService?.name).toBe("New Name Only");
			expect(updatedService?.details).toEqual(originalDetails); // preserved
			expect(updatedService?.duration).toBe(45); // preserved
		}
	});
});
