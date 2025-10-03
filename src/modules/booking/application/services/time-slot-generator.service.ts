import { addMinutes, isAfter, isBefore, set, startOfMinute } from "date-fns";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";

interface TimeSlotConfig {
	timeRange: TimeRange;
	lunchTime: TimeRange;
	duration: number;
	requestedDate: Date;
}

interface DateBoundaries {
	rangeStart: Date;
	rangeEnd: Date;
	lunchStart: Date;
	lunchEnd: Date;
	now: Date;
}

export class TimeSlotGeneratorService {
	static generateTimeSlots(
		timeRange: TimeRange,
		lunchTime: TimeRange,
		duration: number,
		requestedDate: Date
	): Date[] {
		this.validateDuration(duration);

		const boundaries = this.calculateBoundaries({
			timeRange,
			lunchTime,
			duration,
			requestedDate,
		});

		return this.buildTimeSlots(boundaries, duration);
	}

	private static validateDuration(duration: number): void {
		if (duration <= 0) {
			throw new Error("Duration must be positive");
		}
	}

	private static calculateBoundaries(
		config: TimeSlotConfig
	): DateBoundaries {
		const { timeRange, lunchTime, requestedDate } = config;

		return {
			rangeStart: this.makeDate(timeRange.startTime, requestedDate),
			rangeEnd: this.makeDate(timeRange.endTime, requestedDate),
			lunchStart: this.makeDate(lunchTime.startTime, requestedDate),
			lunchEnd: this.makeDate(lunchTime.endTime, requestedDate),
			now: startOfMinute(new Date()),
		};
	}

	private static buildTimeSlots(
		boundaries: DateBoundaries,
		duration: number
	): Date[] {
		const slots: Date[] = [];
		let currentSlot = boundaries.rangeStart;

		while (this.canGenerateSlot(currentSlot, boundaries.rangeEnd)) {
			const slotEnd = addMinutes(currentSlot, duration);

			if (isAfter(slotEnd, boundaries.rangeEnd)) {
				break;
			}

			if (this.isInPast(currentSlot, boundaries.now)) {
				currentSlot = slotEnd;
				continue;
			}

			// Pula slots que conflitam com horário de almoço
			if (this.overlapsLunch(currentSlot, slotEnd, boundaries)) {
				currentSlot = slotEnd;
				continue;
			}

			slots.push(currentSlot);
			currentSlot = slotEnd;
		}

		return slots;
	}

	private static canGenerateSlot(current: Date, rangeEnd: Date): boolean {
		return isBefore(current, rangeEnd);
	}

	private static isInPast(slot: Date, now: Date): boolean {
		return isBefore(slot, now);
	}

	private static overlapsLunch(
		slotStart: Date,
		slotEnd: Date,
		boundaries: DateBoundaries
	): boolean {
		return (
			isBefore(slotStart, boundaries.lunchEnd) &&
			isAfter(slotEnd, boundaries.lunchStart)
		);
	}

	private static makeDate(hhmm: string, requestedDate: Date): Date {
		const [hours, minutes] = hhmm.split(":").map(Number);
		if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
			throw new Error(`Invalid time format: ${hhmm}`);
		}
		return startOfMinute(set(requestedDate, { hours, minutes }));
	}
}