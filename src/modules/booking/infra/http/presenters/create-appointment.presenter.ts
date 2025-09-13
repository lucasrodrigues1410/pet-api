import { BookingPresenter } from "./booking.presenter";

export class CreateAppointmentPresenter {
	static present(appointmentId: string) {
		return BookingPresenter.presentCreateAppointment(appointmentId);
	}
}
