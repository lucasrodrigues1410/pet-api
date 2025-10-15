export class AppointmentExpiredPaymentEvent {
	readonly name = "AppointmentExpiredPaymentEvent";
	constructor(public readonly appointmentId: string) {}
}
