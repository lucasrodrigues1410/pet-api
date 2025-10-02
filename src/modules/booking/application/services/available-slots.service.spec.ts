import { beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { set } from "date-fns";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";
import { TimeSlot } from "../../domain/entities/time-slot.entity";
import { AvailableSlotsService } from "./available-slots.service";

describe("Available Slots Service", () => {
	let moduleRef: any;
	let sut: AvailableSlotsService;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [AvailableSlotsService],
		}).compile();

		sut = moduleRef.get(AvailableSlotsService);
	});

	it("should return empty array when no staff available", () => {
		const slots = [
			set(new Date(), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData: { staffId: string; unavailablePeriods: any[] }[] = [];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toEqual([]);
	});

	it("should return empty array when duration is zero or negative", () => {
		const slots = [
			set(new Date(), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const resultZero = sut.getAvailableSlots({
			slots,
			duration: 0,
			staffsData,
			companyExceptions,
			launchTime,
		});

		const resultNegative = sut.getAvailableSlots({
			slots,
			duration: -10,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(resultZero).toEqual([]);
		expect(resultNegative).toEqual([]);
	});

	it("should return empty array when no slots provided", () => {
		const slots: Date[] = [];
		const duration = 60;
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toEqual([]);
	});

	it("should filter out slots that are in the past", () => {
		const pastTime = set(new Date(), {
			hours: new Date().getHours() - 1,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const futureTime = set(new Date(), {
			hours: new Date().getHours() + 1,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});

		const slots = [pastTime, futureTime];
		const duration = 60;
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0].label).toBe(
			futureTime.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	});

	it("should filter out slots that overlap with launch time", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 11, minutes: 30, seconds: 0, milliseconds: 0 }), // Overlaps with launch
			set(tomorrow, { hours: 12, minutes: 30, seconds: 0, milliseconds: 0 }), // Inside launch time
			set(tomorrow, { hours: 13, minutes: 30, seconds: 0, milliseconds: 0 }), // Overlaps with launch
			set(tomorrow, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }), // After launch time
		];
		const duration = 60;
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(2);
		expect(result[0].label).toBe(
			slots[2].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
		expect(result[1].label).toBe(
			slots[3].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	});

	it("should filter out slots that overlap with company exceptions", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(tomorrow, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(tomorrow, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions = [
			{
				startDate: set(tomorrow, {
					hours: 9,
					minutes: 30,
					seconds: 0,
					milliseconds: 0,
				}),
				endDate: set(tomorrow, {
					hours: 10,
					minutes: 30,
					seconds: 0,
					milliseconds: 0,
				}),
			},
		];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0].label).toBe(
			slots[2].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	});

	it("should filter out slots when all staff are unavailable", () => {
		const slots = [
			set(new Date(), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [
			{
				staffId: "staff-1",
				unavailablePeriods: [
					{
						startDate: set(new Date(), {
							hours: 8,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
						endDate: set(new Date(), {
							hours: 12,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
					},
				],
			},
		];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toEqual([]);
	});

	it("should return available slots when at least one staff is available", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(tomorrow, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [
			{
				staffId: "staff-1",
				unavailablePeriods: [
					{
						startDate: set(tomorrow, {
							hours: 8,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
						endDate: set(tomorrow, {
							hours: 10,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
					},
				],
			},
			{ staffId: "staff-2", unavailablePeriods: [] },
		];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(2);
		expect(result[0].label).toBe(
			slots[0].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
		expect(result[1].label).toBe(
			slots[1].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	});

	it("should handle partial overlap with staff unavailable periods", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(tomorrow, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
			set(tomorrow, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [
			{
				staffId: "staff-1",
				unavailablePeriods: [
					{
						startDate: set(tomorrow, {
							hours: 9,
							minutes: 30,
							seconds: 0,
							milliseconds: 0,
						}),
						endDate: set(tomorrow, {
							hours: 10,
							minutes: 30,
							seconds: 0,
							milliseconds: 0,
						}),
					},
				],
			},
		];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0].label).toBe(
			slots[2].toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
	});

	it("should return slots with correct TimeSlot format", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [{ staffId: "staff-1", unavailablePeriods: [] }];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0]).toBeInstanceOf(TimeSlot);
		expect(result[0].label).toBe("09:00");
	});

	it("should handle edge case where slot ends exactly at staff unavailable period start", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [
			{
				staffId: "staff-1",
				unavailablePeriods: [
					{
						startDate: set(tomorrow, {
							hours: 10,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
						endDate: set(tomorrow, {
							hours: 12,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
					},
				],
			},
		];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0].label).toBe("09:00");
	});

	it("should handle edge case where slot starts exactly at staff unavailable period end", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const slots = [
			set(tomorrow, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
		];
		const duration = 60;
		const staffsData = [
			{
				staffId: "staff-1",
				unavailablePeriods: [
					{
						startDate: set(tomorrow, {
							hours: 9,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
						endDate: set(tomorrow, {
							hours: 10,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						}),
					},
				],
			},
		];
		const companyExceptions: any[] = [];
		const launchTime = new TimeRange({ startTime: "12:00", endTime: "13:00" });

		const result = sut.getAvailableSlots({
			slots,
			duration,
			staffsData,
			companyExceptions,
			launchTime,
		});

		expect(result).toHaveLength(1);
		expect(result[0].label).toBe("10:00");
	});
});
