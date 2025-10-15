import { TimeSlot } from "@/modules/booking/domain/entities/time-slot.entity";

export class AvailableDatesPresenter {
	static present(slots: TimeSlot[]) {
		return { slots: slots.map((slot) => ({ label: slot.label || "" })) };
	}
}
