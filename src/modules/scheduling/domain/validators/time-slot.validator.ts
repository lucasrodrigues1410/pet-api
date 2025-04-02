import {
	addMinutes,
	differenceInMinutes,
	isAfter,
	isBefore,
	setHours,
	setMinutes,
	startOfDay,
} from "date-fns";

export class TimeSlotValidator {
	static isValid(
		selectedTime: Date,
		serviceDuration: number,
		openingTime: string,
		closingTime: string,
	): boolean {
		const [openingHour, openingMinute] = openingTime.split(":").map(Number);
		const [closingHour, closingMinute] = closingTime.split(":").map(Number);

		const dayStart = startOfDay(selectedTime);
		const openingDate = setMinutes(
			setHours(dayStart, openingHour),
			openingMinute,
		);
		const closingDate = setMinutes(
			setHours(dayStart, closingHour),
			closingMinute,
		);

		if (
			isBefore(selectedTime, openingDate) ||
			isAfter(selectedTime, closingDate)
		) {
			return false;
		}

		const appointmentEnd = addMinutes(selectedTime, serviceDuration);
		if (isAfter(appointmentEnd, closingDate)) {
			return false;
		}

		const minutesSinceOpening = differenceInMinutes(selectedTime, openingDate);
		return minutesSinceOpening % serviceDuration === 0;
	}
}
