import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeService } from "test/factories/make-service";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { DeactivateServiceUseCase } from "./deactivate-service.use-case";

interface MockServiceRepository {
	findById: jest.Mock;
	update: jest.Mock;
}
let mockServiceRepository: MockServiceRepository;
interface MockStaffRepository {
	findByUserId: jest.Mock;
}
let mockStaffRepository: MockStaffRepository;
let sut: DeactivateServiceUseCase;
let moduleRef: any;

describe("Deactivate Service", () => {
	beforeEach(async () => {
		mockServiceRepository = {
			findById: jest.fn(async () => undefined),
			update: jest.fn(async () => undefined),
		};
		mockStaffRepository = { findByUserId: jest.fn(async () => undefined) };
		moduleRef = await Test.createTestingModule({
			providers: [
				DeactivateServiceUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();
		sut = moduleRef.get(DeactivateServiceUseCase);
	});

	it("should be able to deactivate a service", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, isActive: true });
		mockServiceRepository.findById.mockResolvedValueOnce(service);
		// Authorized staff (admin) from the same company
		mockStaffRepository.findByUserId.mockResolvedValueOnce(
			Staff.create({
				userId: new UniqueEntityID("test-user-id"),
				companyId,
				role: "admin",
			}),
		);

		const result = await sut.execute({
			id: service.id.toString(),
			companyId: companyId.toString(),
			userId: "test-user-id",
		});

		expect(result.isRight()).toBe(true);
		expect(mockServiceRepository.update).toHaveBeenCalledWith(
			service.id.toString(),
			{ isActive: false },
		);
	});

	it("should return error when service not found", async () => {
		mockServiceRepository.findById.mockResolvedValueOnce(undefined);
		// Return a staff from a different company to ensure early not-found
		mockStaffRepository.findByUserId.mockResolvedValueOnce(
			Staff.create({
				userId: new UniqueEntityID("test-user-id"),
				companyId: new UniqueEntityID("another-company"),
				role: "admin",
			}),
		);
		const result = await sut.execute({
			id: "non-existent-id",
			companyId: "non-existent-company-id",
			userId: "test-user-id",
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Recurso não encontrado");
		}
	});

	it("should be able to deactivate multiple services", async () => {
		const companyId = new UniqueEntityID();
		const service1 = makeService({ companyId, isActive: true });
		const service2 = makeService({ companyId, isActive: true });
		const service3 = makeService({ companyId, isActive: true });

		mockServiceRepository.findById
			.mockResolvedValueOnce(service1)
			.mockResolvedValueOnce(service2)
			.mockResolvedValueOnce(service3);

		// Same authorized staff for each call
		mockStaffRepository.findByUserId
			.mockResolvedValueOnce(
				Staff.create({
					userId: new UniqueEntityID("test-user-id"),
					companyId,
					role: "admin",
				}),
			)
			.mockResolvedValueOnce(
				Staff.create({
					userId: new UniqueEntityID("test-user-id"),
					companyId,
					role: "admin",
				}),
			)
			.mockResolvedValueOnce(
				Staff.create({
					userId: new UniqueEntityID("test-user-id"),
					companyId,
					role: "admin",
				}),
			);

		// Deactivate first service
		const result1 = await sut.execute({
			id: service1.id.toString(),
			companyId: companyId.toString(),
			userId: "test-user-id",
		});
		expect(result1.isRight()).toBe(true);

		// Deactivate second service
		const result2 = await sut.execute({
			id: service2.id.toString(),
			companyId: companyId.toString(),
			userId: "test-user-id",
		});
		expect(result2.isRight()).toBe(true);

		expect(mockServiceRepository.update).toHaveBeenNthCalledWith(
			1,
			service1.id.toString(),
			{ isActive: false },
		);
		expect(mockServiceRepository.update).toHaveBeenNthCalledWith(
			2,
			service2.id.toString(),
			{ isActive: false },
		);
	});

	it("should handle deactivating already deactivated service", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, isActive: false });
		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockStaffRepository.findByUserId.mockResolvedValueOnce(
			Staff.create({
				userId: new UniqueEntityID("test-user-id"),
				companyId,
				role: "admin",
			}),
		);

		const result = await sut.execute({
			id: service.id.toString(),
			companyId: companyId.toString(),
			userId: "test-user-id",
		});

		expect(result.isRight()).toBe(true);
		expect(mockServiceRepository.update).toHaveBeenCalledWith(
			service.id.toString(),
			{ isActive: false },
		);
	});
});
