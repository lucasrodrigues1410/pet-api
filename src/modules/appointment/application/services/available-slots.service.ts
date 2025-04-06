import { addMinutes, isWithinInterval } from "date-fns";
import { TimeSlot } from "../../domain/entities/time-slot.entity";

export class AvailableSlotsService {
	filterAvailableSlots(
		slots: Date[],
		serviceDuration: number,
		invalidRange: { startDate: Date; endDate: Date }[][],
	): TimeSlot[] {
		const availableSlots = slots.filter((slot) => {
			const slotEnd = addMinutes(slot, serviceDuration);

			for (const range of invalidRange) {
				if (
					range.some((r) =>
						isWithinInterval(slotEnd, {
							start: r.startDate,
							end: r.endDate,
						}),
					)
				) {
					return false;
				}
			}

			return true;
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
