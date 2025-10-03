import { differenceInMinutes, format, startOfDay } from "date-fns";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { TimeSlot } from "../../domain/entities/time-slot.entity";

interface FilterParams {
	slots: Date[];
	duration: number;
	appointments: Appointment[];
	totalStaff: number;
}

interface AppointmentMinutes {
	start: number;
	end: number;
}

export class AvailableSlotsService {
	static getAvailableSlots({
		slots,
		duration,
		appointments,
		totalStaff,
	}: FilterParams): TimeSlot[] {
		if (slots.length === 0) return [];
		const appointmentsInMinutes = this.preprocessAppointments(appointments);
		const slotCounts = this.calculateSlotOccupancy(
			slots,
			duration,
			appointmentsInMinutes
		);
		return this.buildAvailableTimeSlots(slots, slotCounts, totalStaff);
	}

	private static preprocessAppointments(
		appointments: Appointment[]
	): AppointmentMinutes[] {
		return appointments.map((apt) => ({
			start: this.timeToMinutes(apt.startDate),
			end: this.timeToMinutes(apt.endDate),
		}));
	}

	private static calculateSlotOccupancy(
		slots: Date[],
		duration: number,
		appointments: AppointmentMinutes[]
	): Map<string, number> {
		const slotCounts = new Map<string, number>();

		for (const slot of slots) {
			const slotKey = slot.toISOString();
			const slotStart = this.timeToMinutes(slot);
			const slotEnd = slotStart + duration;

			// Conta quantos appointments ocupam este slot
			const overlaps = appointments.filter(
				(apt) => Math.max(apt.start, slotStart) < Math.min(apt.end, slotEnd)
			).length;

			slotCounts.set(slotKey, overlaps);
		}

		return slotCounts;
	}

	private static buildAvailableTimeSlots(
		slots: Date[],
		slotCounts: Map<string, number>,
		totalStaff: number
	): TimeSlot[] {
		const availableSlots: TimeSlot[] = [];

		for (const slot of slots) {
			const count = slotCounts.get(slot.toISOString()) ?? 0;
			
			if (count < totalStaff) {
				availableSlots.push(
					TimeSlot.create({ label: format(slot, "HH:mm") })
				);
			}
		}

		return availableSlots;
	}

	private static timeToMinutes(time: Date): number {
		return differenceInMinutes(time, startOfDay(time));
	}
}