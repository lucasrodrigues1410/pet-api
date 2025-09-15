import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAppointment } from "test/factories/make-appointment";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PaginationResult } from "@/shared/utils/pagination";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { GetAppointmentByUserIdUseCase } from "./get-appointment-by-user-id.use-case";

describe("GetAppointmentByUserIdUseCase", () => {
	let moduleRef: any;
	let sut: GetAppointmentByUserIdUseCase;

	const mockAppointmentRepo = {
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		mockAppointmentRepo.findById.mockReset();
		mockAppointmentRepo.findByUserId.mockReset();
		mockAppointmentRepo.findByCompanyId.mockReset();
		mockAppointmentRepo.create.mockReset();
		mockAppointmentRepo.update.mockReset();
		mockAppointmentRepo.delete.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetAppointmentByUserIdUseCase,
				{ provide: AppointmentRepository, useValue: mockAppointmentRepo },
			],
		}).compile();

		sut = moduleRef.get(GetAppointmentByUserIdUseCase);
	});

	it("should be able to get an appointment by user id", async () => {
		const userId = new UniqueEntityID();
		const appointments = [
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
		];

		const mockPaginationResult: PaginationResult<any> = {
			items: appointments,
			meta: { total: 3, page: 1, limit: 10, totalPages: 1 },
		};

		mockAppointmentRepo.findByUserId.mockResolvedValueOnce(
			mockPaginationResult,
		);

		const result = await sut.execute({
			userId: userId.toString(),
			query: { page: 1, limit: 10 },
		});

		const items = result.value?.items;

		expect(items).toHaveLength(3);
		expect((items ?? [])[0].clientId.toString()).toEqual(userId.toString());
		expect(mockAppointmentRepo.findByUserId).toHaveBeenCalledWith({
			userId: userId.toString(),
			query: { page: 1, limit: 10 },
		});
	});

	it("should not be able to get an appointment by user id if user id is invalid", async () => {
		const mockPaginationResult: PaginationResult<any> = {
			items: [],
			meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
		};

		mockAppointmentRepo.findByUserId.mockResolvedValueOnce(
			mockPaginationResult,
		);

		const result = await sut.execute({
			userId: "invalid-user-id",
			query: { page: 1, limit: 10 },
		});

		expect(result.value?.items).toHaveLength(0);
		expect(mockAppointmentRepo.findByUserId).toHaveBeenCalledWith({
			userId: "invalid-user-id",
			query: { page: 1, limit: 10 },
		});
	});
});
