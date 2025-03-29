import { beforeEach, describe, it, expect } from 'bun:test';
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeService } from "test/factories/make-service";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { ListServicesByCompanyUseCase } from "./list-services-by-company.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let sut: ListServicesByCompanyUseCase;

describe("List services by company", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		sut = new ListServicesByCompanyUseCase(inMemoryServicesRepository);
	});

	it("should get a services by company", async () => {
		const randomId = new UniqueEntityID();
		const services = Array.from({ length: 5 }, () =>
			makeService({ companyId: randomId }),
		);
		const companyId = services[0].companyId;
		for (const service of services) {
			await inMemoryServicesRepository.create(service);
		}
		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			services: expect.arrayContaining(
				services.map((service) =>
					expect.objectContaining({
						name: service.name,
						description: service.description,
						price: service.price,
						companyId: service.companyId,
					}),
				),
			),
		});
	});
});
