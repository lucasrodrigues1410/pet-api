import { TimeSlot } from "@/modules/booking/domain/entities/time-slot.entity";

export class BookingPresenter {
	static presentAvailableDates(slots: TimeSlot[]) {
		return { slots: slots.map((slot) => ({ label: slot.label || "" })) };
	}

	static presentCreateAppointment(appointmentId: string) {
		return { appointmentId };
	}
}
