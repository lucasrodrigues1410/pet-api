import { addMinutes, isWithinInterval } from "date-fns";
import { TimeSlot } from "../../domain/entities/time-slot.entity";

export class AvailableSlotsService {
	filterAvailableSlots(
		slots: Date[],
		serviceDuration: number,
		appointments: { startDate: Date; endDate: Date }[],
		exceptions: { startDate: Date; endDate: Date }[],
	): TimeSlot[] {
		const availableSlots = slots.filter((slot) => {
			const slotEnd = addMinutes(slot, serviceDuration);

			const hasAppointment = appointments.some((appointment) =>
				isWithinInterval(slotEnd, {
					start: new Date(appointment.startDate),
					end: new Date(appointment.endDate),
				}),
			);
			const hasException = exceptions.some((exception) =>
				isWithinInterval(slotEnd, {
					start: new Date(exception.startDate),
					end: new Date(exception.endDate),
				}),
			);
			return !hasAppointment && !hasException;
		});

		// Transforma cada Date em uma entidade TimeSlot (supondo que ela possua um método estático create)
		return availableSlots.map((slot) =>
			TimeSlot.create({
				label: slot.toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			}),
		);
	}
}
