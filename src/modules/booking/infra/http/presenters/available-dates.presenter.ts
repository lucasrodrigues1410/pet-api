import { TimeSlot } from "@/modules/booking/domain/entities/time-slot.entity";
import { BookingPresenter } from "./booking.presenter";

export class AvailableDatesPresenter {
	static present(slots: TimeSlot[]) {
		return BookingPresenter.presentAvailableDates(slots);
	}
}
