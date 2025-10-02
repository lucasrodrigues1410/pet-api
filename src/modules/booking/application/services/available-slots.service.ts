import { differenceInMinutes, format, startOfDay } from "date-fns";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { TimeSlot } from "../../domain/entities/time-slot.entity";

interface FilterParams {
	slots: Date[];
	duration: number;
	appointments: Appointment[];
	totalStaff: number;
}

export class AvailableSlotsService {
	static getAvailableSlots({
		slots,
		duration,
		appointments,
		totalStaff,
	}: FilterParams): TimeSlot[] {
		const slotCounts: { [key: string]: number } = {};
		slots.forEach((slot) => {
			slotCounts[slot.toISOString()] = 0;
		});

		appointments.forEach((appointment) => {
			const apptStart = this.timeToMinutes(appointment.startDate);
			const apptEnd = this.timeToMinutes(appointment.endDate);

			slots.forEach((slot) => {
				const slotStart = this.timeToMinutes(slot);
				const slotEnd = slotStart + duration;

				if (Math.max(apptStart, slotStart) < Math.min(apptEnd, slotEnd)) {
					slotCounts[slot.toISOString()]++;
				}
			});
		});

		return slots
			.filter((slot) => slotCounts[slot.toISOString()] < totalStaff)
			.map((slot) => TimeSlot.create({ label: format(slot, "HH:mm") }));
	}

	private static timeToMinutes(time: Date): number {
		return differenceInMinutes(time, startOfDay(time));
	}
}
