import { addMinutes, isBefore, set } from "date-fns";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";

export class TimeSlotGeneratorService {
	generateTimeSlots(
		timeRange: TimeRange,
		duration: number,
		requestedDate: Date,
	): Date[] {
		const slots: Date[] = [];
		const [startHour, startMinute] = timeRange.startTime.split(":").map(Number);
		const [endHour, endMinute] = timeRange.endTime.split(":").map(Number);

		let start = set(requestedDate, {
			hours: startHour,
			minutes: startMinute,
			seconds: 0,
			milliseconds: 0,
		});

		const end = set(requestedDate, {
			hours: endHour,
			minutes: endMinute,
			seconds: 0,
			milliseconds: 0,
		});

		while (isBefore(start, end)) {
			slots.push(start);
			start = addMinutes(start, duration);
		}
		return slots;
	}
}
