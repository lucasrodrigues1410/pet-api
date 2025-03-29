import { beforeEach, describe, it, expect } from 'bun:test';
import { makeService } from "test/factories/make-service";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { GetServiceByIdUseCase } from "./get-service-by-id.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let sut: GetServiceByIdUseCase;

describe("Get a service", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		sut = new GetServiceByIdUseCase(inMemoryServicesRepository);
	});

	it("should get a service by id", async () => {
		const service = makeService();
		inMemoryServicesRepository.create(service);
		const result = await sut.execute({
			id: service.id.toString(),
		});
		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			service: expect.objectContaining({
				name: service.name,
				description: service.description,
				price: service.price,
				companyId: service.companyId,
			}),
		});
	});
});
