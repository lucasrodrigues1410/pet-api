import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeService } from "test/factories/make-service";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { ListServicesByCompanyUseCase } from "./list-services-by-company.use-case";

interface MockServiceRepository {
	findByCompanyId: jest.Mock;
}
let mockServiceRepository: MockServiceRepository;
let sut: ListServicesByCompanyUseCase;
let moduleRef: any;

describe("List services by company", () => {
	beforeEach(async () => {
		mockServiceRepository = { findByCompanyId: jest.fn(async () => []) };
		moduleRef = await Test.createTestingModule({
			providers: [
				ListServicesByCompanyUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
			],
		}).compile();
		sut = moduleRef.get(ListServicesByCompanyUseCase);
	});

	it("should get a services by company", async () => {
		const randomId = new UniqueEntityID();
		const services = Array.from({ length: 5 }, () =>
			makeService({ companyId: randomId }),
		);
		const companyId = services[0].companyId;
		mockServiceRepository.findByCompanyId.mockResolvedValueOnce(services);
		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);
		expect(result.value?.services).toHaveLength(5);
	});
});
