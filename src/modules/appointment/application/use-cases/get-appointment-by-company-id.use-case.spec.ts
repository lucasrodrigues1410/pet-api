import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAppointment } from "test/factories/make-appointment";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { PaginationResult } from "@/shared/utils/pagination";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { GetAppointmentByCompanyIdUseCase } from "./get-appointment-by-company-id.use-case";

describe("GetAppointmentByCompanyIdUseCase", () => {
	let moduleRef: any;
	let sut: GetAppointmentByCompanyIdUseCase;

	const mockAppointmentRepo = {
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockStaffRepo = {
		findByUserEmail: jest.fn(),
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		fetchCompanyStaffWithAppointmentsInDateRange: jest.fn(),
		findAvailableForSlot: jest.fn(),
		create: jest.fn(),
		delete: jest.fn(),
		totalStaffByCompanyId: jest.fn(),
	};

	beforeEach(async () => {
		mockAppointmentRepo.findById.mockReset();
		mockAppointmentRepo.findByUserId.mockReset();
		mockAppointmentRepo.findByCompanyId.mockReset();
		mockAppointmentRepo.create.mockReset();
		mockAppointmentRepo.update.mockReset();
		mockAppointmentRepo.delete.mockReset();
		mockStaffRepo.findByUserEmail.mockReset();
		mockStaffRepo.findById.mockReset();
		mockStaffRepo.findByUserId.mockReset();
		mockStaffRepo.findByCompanyId.mockReset();
		mockStaffRepo.fetchCompanyStaffWithAppointmentsInDateRange.mockReset();
		mockStaffRepo.findAvailableForSlot.mockReset();
		mockStaffRepo.create.mockReset();
		mockStaffRepo.delete.mockReset();
		mockStaffRepo.totalStaffByCompanyId.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetAppointmentByCompanyIdUseCase,
				{ provide: AppointmentRepository, useValue: mockAppointmentRepo },
				{ provide: StaffRepository, useValue: mockStaffRepo },
			],
		}).compile();

		sut = moduleRef.get(GetAppointmentByCompanyIdUseCase);
	});

	it("should be able to get appointments by company id", async () => {
		const companyId = new UniqueEntityID("company-1");
		const userId = new UniqueEntityID("user-1");
		const staff = makeStaff({ userId, companyId });

		const appointments = [
			makeAppointment({ companyId }),
			makeAppointment({ companyId }),
			makeAppointment({ companyId }),
		];

		const mockPaginationResult: PaginationResult<any> = {
			items: appointments,
			meta: { total: 3, page: 1, limit: 10, totalPages: 1 },
		};

		mockStaffRepo.findByUserId.mockResolvedValueOnce(staff);
		mockAppointmentRepo.findByCompanyId.mockResolvedValueOnce(
			mockPaginationResult,
		);

		const result = await sut.execute({
			userId: userId.toString(),
			query: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		const items = "items" in result.value ? result.value.items : [];

		expect(items).toHaveLength(3);
		expect((items ?? [])[0].companyId.toString()).toEqual(companyId.toString());
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(userId.toString());
		expect(mockAppointmentRepo.findByCompanyId).toHaveBeenCalledWith({
			companyId: companyId.toString(),
			query: { page: 1, limit: 10 },
		});
	});

	it("should be able to get appointments by company id with filters", async () => {
		const companyId = new UniqueEntityID("company-1");
		const userId = new UniqueEntityID("user-1");
		const staff = makeStaff({ userId, companyId });

		const appointments = [makeAppointment({ companyId })];

		const mockPaginationResult: PaginationResult<any> = {
			items: appointments,
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		};

		mockStaffRepo.findByUserId.mockResolvedValueOnce(staff);
		mockAppointmentRepo.findByCompanyId.mockResolvedValueOnce(
			mockPaginationResult,
		);

		const result = await sut.execute({
			userId: userId.toString(),
			query: {
				page: 1,
				limit: 10,
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-12-31"),
				status: ["scheduled", "completed"],
				query: "search term",
			},
		});

		expect(result.isRight()).toBe(true);
		const items = "items" in result.value ? result.value.items : [];

		expect(items).toHaveLength(1);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(userId.toString());
		expect(mockAppointmentRepo.findByCompanyId).toHaveBeenCalledWith({
			companyId: companyId.toString(),
			query: {
				page: 1,
				limit: 10,
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-12-31"),
				status: ["scheduled", "completed"],
				query: "search term",
			},
		});
	});

	it("should return empty result when no appointments found", async () => {
		const companyId = new UniqueEntityID("company-1");
		const userId = new UniqueEntityID("user-1");
		const staff = makeStaff({ userId, companyId });

		const mockPaginationResult: PaginationResult<any> = {
			items: [],
			meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
		};

		mockStaffRepo.findByUserId.mockResolvedValueOnce(staff);
		mockAppointmentRepo.findByCompanyId.mockResolvedValueOnce(
			mockPaginationResult,
		);

		const result = await sut.execute({
			userId: userId.toString(),
			query: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		expect("items" in result.value ? result.value.items : []).toHaveLength(0);
		expect("meta" in result.value ? result.value.meta.total : 0).toBe(0);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(userId.toString());
		expect(mockAppointmentRepo.findByCompanyId).toHaveBeenCalledWith({
			companyId: companyId.toString(),
			query: { page: 1, limit: 10 },
		});
	});
});
