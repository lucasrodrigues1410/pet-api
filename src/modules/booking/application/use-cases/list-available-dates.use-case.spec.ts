import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { addDays } from "date-fns";
import { makeService } from "test/factories/make-service";
import { makeStaff } from "test/factories/make-staff";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { ListAvailableDatesUseCase } from "./list-available-dates.use-case";

describe("List Available Dates Use Case", () => {
	let moduleRef: any;
	let sut: ListAvailableDatesUseCase;

	const mockCompanyAvailabilityRepository = {
		findByCompanyIdAndDayOfWeek: jest.fn(),
	};

	const mockCompanyAvailabilityExceptionRepository = {
		findExceptionsByCompanyAndPeriod: jest.fn(),
	};

	const mockServiceRepository = { findById: jest.fn() };

	const mockStaffRepository = {
		fetchCompanyStaffWithAppointmentsInDateRange: jest.fn(),
	};

	beforeEach(async () => {
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockReset();
		mockCompanyAvailabilityExceptionRepository.findExceptionsByCompanyAndPeriod.mockReset();
		mockServiceRepository.findById.mockReset();
		mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				ListAvailableDatesUseCase,
				{
					provide: CompanyAvailabilityRepository,
					useValue: mockCompanyAvailabilityRepository,
				},
				{
					provide: CompanyAvailabilityExcpetionRepository,
					useValue: mockCompanyAvailabilityExceptionRepository,
				},
				{ provide: ServiceRepository, useValue: mockServiceRepository },
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();

		sut = moduleRef.get(ListAvailableDatesUseCase);
	});

	it("should list available dates successfully", async () => {
		const service = makeService({ duration: 60 });
		const companyId = "company-id";
		const serviceId = service.id.toString();
		const date = addDays(new Date(), 1);

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
			launchTime: { startTime: "12:00", endTime: "13:00" },
		};

		const mockStaff = makeStaff();
		const mockStaffWithAppointments = {
			...mockStaff,
			id: mockStaff.id,
			appointments: [],
		};

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockCompanyAvailabilityExceptionRepository.findExceptionsByCompanyAndPeriod.mockResolvedValueOnce(
			[],
		);
		mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange.mockResolvedValueOnce(
			[mockStaffWithAppointments],
		);

		const result = await sut.execute({ companyId, serviceId, date });

		expect(result.isRight()).toBe(true);
		expect(result.value as any).toHaveProperty("slots");
		expect(Array.isArray((result.value as any).slots)).toBe(true);
		expect(mockServiceRepository.findById).toHaveBeenCalledWith(serviceId);
		expect(
			mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek,
		).toHaveBeenCalledWith(companyId, expect.any(String));
		expect(
			mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange,
		).toHaveBeenCalledWith(companyId, expect.any(Object));
	});

	it("should return error when service is not found", async () => {
		const companyId = "company-id";
		const serviceId = "non-existent-service";
		const date = addDays(new Date(), 1);

		mockServiceRepository.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({ companyId, serviceId, date });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect((result.value as any).message).toBe("Serviço não encontrado");
		expect(
			mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek,
		).not.toHaveBeenCalled();
	});

	it("should return error when company availability is not found", async () => {
		const service = makeService();
		const companyId = "company-id";
		const serviceId = service.id.toString();
		const date = addDays(new Date(), 1);

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			null,
		);

		const result = await sut.execute({ companyId, serviceId, date });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect((result.value as any).message).toBe(
			"Disponibilidade da empresa não encontrada",
		);
	});

	it("should return error when invalid parameters are provided", async () => {
		const result = await sut.execute({
			companyId: "",
			serviceId: "",
			date: new Date("invalid-date"),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(Error);
		expect((result.value as any).message).toBe(
			"Parâmetros inválidos: companyId, serviceId ou date",
		);
	});

	it("should handle staff with existing appointments", async () => {
		const service = makeService({ duration: 60 });
		const companyId = "company-id";
		const serviceId = service.id.toString();
		const date = addDays(new Date(), 1);

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
			launchTime: { startTime: "12:00", endTime: "13:00" },
		};

		const mockStaff = makeStaff();
		const mockAppointment = {
			startDate: addDays(new Date(), 1),
			endDate: addDays(new Date(), 1),
		};
		const mockStaffWithAppointments = {
			...mockStaff,
			id: mockStaff.id,
			appointments: [mockAppointment],
		};

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockCompanyAvailabilityExceptionRepository.findExceptionsByCompanyAndPeriod.mockResolvedValueOnce(
			[],
		);
		mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange.mockResolvedValueOnce(
			[mockStaffWithAppointments],
		);

		const result = await sut.execute({ companyId, serviceId, date });

		expect(result.isRight()).toBe(true);
		expect(result.value as any).toHaveProperty("slots");
		expect(
			mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange,
		).toHaveBeenCalledWith(
			companyId,
			expect.objectContaining({
				startDate: expect.any(Date),
				endDate: expect.any(Date),
			}),
		);
	});

	it("should handle company availability exceptions", async () => {
		const service = makeService({ duration: 60 });
		const companyId = "company-id";
		const serviceId = service.id.toString();
		const date = addDays(new Date(), 1);

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
			launchTime: { startTime: "12:00", endTime: "13:00" },
		};

		const mockException = {
			startDate: addDays(new Date(), 1),
			endDate: addDays(new Date(), 1),
		};

		const mockStaff = makeStaff();
		const mockStaffWithAppointments = {
			...mockStaff,
			id: mockStaff.id,
			appointments: [],
		};

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockCompanyAvailabilityExceptionRepository.findExceptionsByCompanyAndPeriod.mockResolvedValueOnce(
			[mockException],
		);
		mockStaffRepository.fetchCompanyStaffWithAppointmentsInDateRange.mockResolvedValueOnce(
			[mockStaffWithAppointments],
		);

		const result = await sut.execute({ companyId, serviceId, date });

		expect(result.isRight()).toBe(true);
		expect(result.value as any).toHaveProperty("slots");
		expect(
			mockCompanyAvailabilityExceptionRepository.findExceptionsByCompanyAndPeriod,
		).toHaveBeenCalledWith(
			companyId,
			expect.objectContaining({
				startDate: expect.any(Date),
				endDate: expect.any(Date),
			}),
		);
	});
});
