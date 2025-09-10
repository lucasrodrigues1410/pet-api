import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeService } from "test/factories/make-service";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { GetServiceByIdUseCase } from "./get-service-by-id.use-case";

interface MockServiceRepository {
	findById: jest.Mock;
}
let mockServiceRepository: MockServiceRepository;
let sut: GetServiceByIdUseCase;
let moduleRef: any;

describe("Get a service", () => {
	beforeEach(async () => {
		mockServiceRepository = { findById: jest.fn(async () => undefined) };
		moduleRef = await Test.createTestingModule({
			providers: [
				GetServiceByIdUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
			],
		}).compile();
		sut = moduleRef.get(GetServiceByIdUseCase);
	});

	it("should get a service by id", async () => {
		const service = makeService();
		mockServiceRepository.findById.mockResolvedValueOnce(service);
		const result = await sut.execute({ id: service.id.toString() });
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
