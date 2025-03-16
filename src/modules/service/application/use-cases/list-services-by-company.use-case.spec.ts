import { InMemoryServiceRepository } from "test/repositories/in-memory-service-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeService } from "test/factories/make-service";
import { ListServicesByCompanyUseCase } from "./list-services-by-company.use-case";

let inMemoryServicesRepository: InMemoryServiceRepository;
let useCase: ListServicesByCompanyUseCase;

describe("List services by company", () => {
	beforeEach(() => {
		inMemoryServicesRepository = new InMemoryServiceRepository();
		useCase = new ListServicesByCompanyUseCase(inMemoryServicesRepository);
	});

	it("should get a services by company", async () => {
		const services = Array.from({ length: 5 }, () =>
			makeService({ companyId: 1 }),
		);
		const companyId = services[0].companyId;
		for (const service of services) {
			await inMemoryServicesRepository.create(service);
		}
		const result = await useCase.execute({
			companyId,
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
