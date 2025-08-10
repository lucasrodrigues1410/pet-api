import { beforeEach, describe, expect, it } from "bun:test";
import { makeService } from "test/factories/make-service";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DeleteServiceUseCase } from "./delete-service.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let sut: DeleteServiceUseCase;

describe("Delete Service", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		sut = new DeleteServiceUseCase(inMemoryServicesRepository);
	});

	it("should be able to delete a service (soft delete)", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, isActive: true });
		await inMemoryServicesRepository.create(service);

		const result = await sut.execute({
			id: service.id.toString(),
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		
		// Verify service is marked as inactive
		const deletedService = await inMemoryServicesRepository.findById(service.id.toString());
		expect(deletedService?.isActive).toBe(false);
	});

	it("should return error when service not found", async () => {
		const result = await sut.execute({
			id: "non-existent-id",
			companyId: "non-existent-company-id",
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Recurso não encontrado");
		}
	});

	it("should be able to delete multiple services", async () => {
		const companyId = new UniqueEntityID();
		const service1 = makeService({ companyId, isActive: true });
		const service2 = makeService({ companyId, isActive: true });
		const service3 = makeService({ companyId, isActive: true });

		await inMemoryServicesRepository.create(service1);
		await inMemoryServicesRepository.create(service2);
		await inMemoryServicesRepository.create(service3);

		// Delete first service
		const result1 = await sut.execute({ 
			id: service1.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result1.isRight()).toBe(true);

		// Delete second service
		const result2 = await sut.execute({ 
			id: service2.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result2.isRight()).toBe(true);

		// Verify both are marked as inactive
		const deletedService1 = await inMemoryServicesRepository.findById(service1.id.toString());
		const deletedService2 = await inMemoryServicesRepository.findById(service2.id.toString());
		const activeService3 = await inMemoryServicesRepository.findById(service3.id.toString());

		expect(deletedService1?.isActive).toBe(false);
		expect(deletedService2?.isActive).toBe(false);
		expect(activeService3?.isActive).toBe(true);
	});

	it("should handle deleting already deleted service", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, isActive: false }); // Already inactive
		await inMemoryServicesRepository.create(service);

		const result = await sut.execute({
			id: service.id.toString(),
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		
		// Service should remain inactive
		const deletedService = await inMemoryServicesRepository.findById(service.id.toString());
		expect(deletedService?.isActive).toBe(false);
	});
});
