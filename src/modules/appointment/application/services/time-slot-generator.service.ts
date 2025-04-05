import { addMinutes, isBefore } from "date-fns";

export class TimeSlotGeneratorService {
	generateTimeSlots(
		startTime: string,
		endTime: string,
		duration: number,
		baseDate: Date,
	): Date[] {
		const slots: Date[] = [];
		const [startHour, startMinute] = startTime.split(":").map(Number);
		const [endHour, endMinute] = endTime.split(":").map(Number);

		const start = new Date(baseDate);
		start.setHours(startHour, startMinute, 0, 0);

		const end = new Date(baseDate);
		end.setHours(endHour, endMinute, 0, 0);

		let currentSlot = new Date(start);
		while (isBefore(currentSlot, end)) {
			slots.push(new Date(currentSlot));
			currentSlot = addMinutes(currentSlot, duration);
		}
		return slots;
	}
}
