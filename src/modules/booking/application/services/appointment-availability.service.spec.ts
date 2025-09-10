import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { addMinutes, set } from "date-fns";
import { makeStaff } from "test/factories/make-staff";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { AppointmentAvailabilityService } from "./appointment-availability.service";

describe("Appointment Availability Service", () => {
	let moduleRef: any;
	let sut: AppointmentAvailabilityService;

	const mockCompanyAvailabilityRepository = {
		findByCompanyIdAndDayOfWeek: jest.fn(),
	};

	const mockStaffRepository = { findAvailableForSlot: jest.fn() };

	beforeEach(async () => {
		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockReset();
		mockStaffRepository.findAvailableForSlot.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AppointmentAvailabilityService,
				{
					provide: CompanyAvailabilityRepository,
					useValue: mockCompanyAvailabilityRepository,
				},
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();

		sut = moduleRef.get(AppointmentAvailabilityService);
	});

	it("should return valid availability when staff is available", async () => {
		const companyId = "company-id";
		const startDate = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
		};

		const mockStaff = makeStaff();
		const mockAvailableStaff = [mockStaff];

		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockStaffRepository.findAvailableForSlot.mockResolvedValueOnce(
			mockAvailableStaff,
		);

		const result = await sut.getAvailability(
			companyId,
			startDate,
			serviceDuration,
		);

		expect(result.isValid).toBe(true);
		expect(result.staffChoiced).toBeDefined();
		expect(
			mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek,
		).toHaveBeenCalledWith(companyId, expect.any(String));
		expect(mockStaffRepository.findAvailableForSlot).toHaveBeenCalledWith(
			companyId,
			expect.objectContaining({
				startDate,
				endDate: addMinutes(startDate, serviceDuration),
			}),
		);
	});

	it("should return invalid availability when no company availability found", async () => {
		const companyId = "company-id";
		const startDate = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;

		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			null,
		);
		mockStaffRepository.findAvailableForSlot.mockResolvedValueOnce([]);

		const result = await sut.getAvailability(
			companyId,
			startDate,
			serviceDuration,
		);

		expect(result.isValid).toBe(false);
		expect(result.staffChoiced).toBeNull();
	});

	it("should return invalid availability when no staff available", async () => {
		const companyId = "company-id";
		const startDate = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
		};

		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockStaffRepository.findAvailableForSlot.mockResolvedValueOnce([]);

		const result = await sut.getAvailability(
			companyId,
			startDate,
			serviceDuration,
		);

		expect(result.isValid).toBe(false);
		expect(result.staffChoiced).toBeNull();
	});

	it("should validate time slot correctly when within business hours", () => {
		const selectedTime = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "18:00";

		const result = sut.isValid(
			selectedTime,
			serviceDuration,
			openingTime,
			closingTime,
		);

		expect(result).toBe(true);
	});

	it("should validate time slot correctly when at opening time", () => {
		const selectedTime = set(new Date(), {
			hours: 8,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "18:00";

		const result = sut.isValid(
			selectedTime,
			serviceDuration,
			openingTime,
			closingTime,
		);

		expect(result).toBe(true);
	});

	it("should validate time slot correctly when service ends at closing time", () => {
		const selectedTime = set(new Date(), {
			hours: 17,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "18:00";

		const result = sut.isValid(
			selectedTime,
			serviceDuration,
			openingTime,
			closingTime,
		);

		expect(result).toBe(true);
	});

	it("should invalidate time slot when before opening time", () => {
		const selectedTime = set(new Date(), {
			hours: 7,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "18:00";

		const result = sut.isValid(
			selectedTime,
			serviceDuration,
			openingTime,
			closingTime,
		);

		expect(result).toBe(false);
	});

	it("should invalidate time slot when service extends beyond closing time", () => {
		const selectedTime = set(new Date(), {
			hours: 17,
			minutes: 30,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "18:00";

		const result = sut.isValid(
			selectedTime,
			serviceDuration,
			openingTime,
			closingTime,
		);

		expect(result).toBe(false);
	});

	it("should throw error when opening time format is invalid", () => {
		const selectedTime = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "invalid-time";
		const closingTime = "18:00";

		expect(() => {
			sut.isValid(selectedTime, serviceDuration, openingTime, closingTime);
		}).toThrow("Invalid opening time format");
	});

	it("should throw error when closing time format is invalid", () => {
		const selectedTime = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;
		const openingTime = "08:00";
		const closingTime = "invalid-time";

		expect(() => {
			sut.isValid(selectedTime, serviceDuration, openingTime, closingTime);
		}).toThrow("Invalid opening time format");
	});

	it("should return random staff when multiple staff available", async () => {
		const companyId = "company-id";
		const startDate = set(new Date(), {
			hours: 10,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const serviceDuration = 60;

		const mockCompanyAvailability = {
			timeRange: { startTime: "08:00", endTime: "18:00" },
		};

		const mockStaff1 = makeStaff();
		const mockStaff2 = makeStaff();
		const mockStaff3 = makeStaff();
		const mockAvailableStaff = [mockStaff1, mockStaff2, mockStaff3];

		mockCompanyAvailabilityRepository.findByCompanyIdAndDayOfWeek.mockResolvedValueOnce(
			mockCompanyAvailability,
		);
		mockStaffRepository.findAvailableForSlot.mockResolvedValueOnce(
			mockAvailableStaff,
		);

		const result = await sut.getAvailability(
			companyId,
			startDate,
			serviceDuration,
		);

		expect(result.isValid).toBe(true);
		expect(result.staffChoiced).toBeDefined();
		expect(mockAvailableStaff).toContain(result.staffChoiced);
	});
});
