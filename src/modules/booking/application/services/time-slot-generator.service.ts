import { addMinutes, isAfter, isBefore, set, startOfMinute } from "date-fns";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";

export class TimeSlotGeneratorService {
	static generateTimeSlots(
		timeRange: TimeRange,
		launchTime: TimeRange,
		duration: number,
		requestedDate: Date,
	): Date[] {
		if (duration <= 0) throw new Error("Duration must be positive");

		const now = startOfMinute(new Date());
		const slots: Date[] = [];

		
		const rangeStart = this.makeDate(timeRange.startTime, requestedDate);
		const rangeEnd = this.makeDate(timeRange.endTime, requestedDate);
		const lunchStart = this.makeDate(launchTime.startTime, requestedDate);
		const lunchEnd = this.makeDate(launchTime.endTime, requestedDate);

		let current = rangeStart;

		while (isBefore(current, rangeEnd)) {
			const slotEnd = addMinutes(current, duration);

			if (isAfter(slotEnd, rangeEnd)) break;

			if (isBefore(current, now)) {
				current = slotEnd;
				continue;
			}

			const overlapsLunch =
				isBefore(current, lunchEnd) && isAfter(slotEnd, lunchStart);
			if (overlapsLunch) {
				current = slotEnd;
				continue;
			}

			slots.push(current);
			current = slotEnd;
		}

		return slots;
	}

	private static makeDate(hhmm: string, requestedDate: Date) {
		const [hours, minutes] = hhmm.split(":").map(Number);
		return startOfMinute(set(requestedDate, { hours, minutes }));
	}
}
