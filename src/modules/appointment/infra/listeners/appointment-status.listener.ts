import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UpdateAppointmentStatusUseCase } from "../../application/use-cases/update-appointment-status.use-case";
import { AppointmentExpiredPaymentEvent } from "../../domain/events/appointment-expired-payment.event copy";
import { AppointmentPaidEvent } from "../../domain/events/appointment-paid.event";

@Injectable()
export class AppointmentStatusListener {
	constructor(
		private readonly updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase,
	) {}

	@OnEvent(AppointmentPaidEvent.name, { async: true })
	async handle(event: AppointmentPaidEvent) {
		await this.updateAppointmentStatusUseCase.execute({
			appointmentId: event.appointmentId,
			status: "confirmed",
		});
	}

	@OnEvent(AppointmentExpiredPaymentEvent.name, { async: true })
	async handleExpired(event: AppointmentExpiredPaymentEvent) {
		await this.updateAppointmentStatusUseCase.execute({
			appointmentId: event.appointmentId,
			status: "canceled",
		});
	}
}
