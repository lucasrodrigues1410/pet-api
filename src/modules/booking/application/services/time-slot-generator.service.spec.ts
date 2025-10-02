import { beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { set } from "date-fns";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";
import { TimeSlotGeneratorService } from "./time-slot-generator.service";

describe("Time Slot Generator Service", () => {
	let moduleRef: any;
	let sut: TimeSlotGeneratorService;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [TimeSlotGeneratorService],
		}).compile();

		sut = moduleRef.get(TimeSlotGeneratorService);
	});

	it("should generate time slots for a basic time range", () => {
		const timeRange = new TimeRange({ startTime: "09:00", endTime: "17:00" });
		const duration = 60; // 1 hour
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(8); // 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[7]).toEqual(set(requestedDate, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 }));
	});

	it("should generate time slots with 30-minute duration", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "11:00" });
		const duration = 30; // 30 minutes
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(4); // 9:00, 9:30, 10:00, 10:30
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[1]).toEqual(set(requestedDate, { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 }));
		expect(result[2]).toEqual(set(requestedDate, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[3]).toEqual(set(requestedDate, { hours: 10, minutes: 30, seconds: 0, milliseconds: 0 }));
	});

	it("should generate time slots with 15-minute duration", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "10:00" });
		const duration = 15; // 15 minutes
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(4); // 9:00, 9:15, 9:30, 9:45
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[1]).toEqual(set(requestedDate, { hours: 9, minutes: 15, seconds: 0, milliseconds: 0 }));
		expect(result[2]).toEqual(set(requestedDate, { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 }));
		expect(result[3]).toEqual(set(requestedDate, { hours: 9, minutes: 45, seconds: 0, milliseconds: 0 }));
	});

	it("should generate time slots with non-standard start and end times", () => {
		const timeRange = TimeRange.create({ startTime: "08:30", endTime: "12:15" });
		const duration = 45; // 45 minutes
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(5); // 8:30, 9:15, 10:00, 10:45, 11:30
		expect(result[0]).toEqual(set(requestedDate, { hours: 8, minutes: 30, seconds: 0, milliseconds: 0 }));
		expect(result[1]).toEqual(set(requestedDate, { hours: 9, minutes: 15, seconds: 0, milliseconds: 0 }));
		expect(result[2]).toEqual(set(requestedDate, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[3]).toEqual(set(requestedDate, { hours: 10, minutes: 45, seconds: 0, milliseconds: 0 }));
		expect(result[4]).toEqual(set(requestedDate, { hours: 11, minutes: 30, seconds: 0, milliseconds: 0 }));
	});

	it("should return empty array when duration is zero", () => {
		const timeRange = new TimeRange({ startTime: "09:00", endTime: "17:00" });
		const duration = 0;
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toEqual([]);
	});

	it("should return empty array when duration is negative", () => {
		const timeRange = new TimeRange({ startTime: "09:00", endTime: "17:00" });
		const duration = -30;
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toEqual([]);
	});

	it("should return empty array when start time equals end time", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "09:00" });
		const duration = 30;
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toEqual([]);
	});

	it("should return empty array when duration is larger than time range", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "10:00" });
		const duration = 90; // 1.5 hours
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toEqual([]);
	});

	it("should generate single slot when duration equals time range", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "10:00" });
		const duration = 60; // 1 hour
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
	});

	it("should handle time range that spans midnight", () => {
		const timeRange = TimeRange.create({ startTime: "23:00", endTime: "01:00" });
		const duration = 30; // 30 minutes
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(4); // 23:00, 23:30, 00:00, 00:30
		expect(result[0]).toEqual(set(requestedDate, { hours: 23, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[1]).toEqual(set(requestedDate, { hours: 23, minutes: 30, seconds: 0, milliseconds: 0 }));
		expect(result[2]).toEqual(set(requestedDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[3]).toEqual(set(requestedDate, { hours: 0, minutes: 30, seconds: 0, milliseconds: 0 }));
	});

	it("should preserve the requested date for all generated slots", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "11:00" });
		const duration = 60;
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 5, // June
			date: 20, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(2);
		expect(result[0].getFullYear()).toBe(2024);
		expect(result[0].getMonth()).toBe(5); // June
		expect(result[0].getDate()).toBe(20);
		expect(result[1].getFullYear()).toBe(2024);
		expect(result[1].getMonth()).toBe(5); // June
		expect(result[1].getDate()).toBe(20);
	});

	it("should handle very small duration", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "09:05" });
		const duration = 1; // 1 minute
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(5); // 9:00, 9:01, 9:02, 9:03, 9:04
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[4]).toEqual(set(requestedDate, { hours: 9, minutes: 4, seconds: 0, milliseconds: 0 }));
	});

	it("should handle fractional duration that results in exact matches", () => {
		const timeRange = TimeRange.create({ startTime: "09:00", endTime: "10:00" });
		const duration = 20; // 20 minutes
		const requestedDate = set(new Date(), { 
			year: 2024, 
			month: 0, 
			date: 15, 
			hours: 0, 
			minutes: 0, 
			seconds: 0, 
			milliseconds: 0 
		});

		const result = sut.generateTimeSlots(timeRange, duration, requestedDate);

		expect(result).toHaveLength(3); // 9:00, 9:20, 9:40
		expect(result[0]).toEqual(set(requestedDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }));
		expect(result[1]).toEqual(set(requestedDate, { hours: 9, minutes: 20, seconds: 0, milliseconds: 0 }));
		expect(result[2]).toEqual(set(requestedDate, { hours: 9, minutes: 40, seconds: 0, milliseconds: 0 }));
	});
});
