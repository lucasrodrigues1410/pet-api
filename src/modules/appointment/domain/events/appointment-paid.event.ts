export class AppointmentPaidEvent {
	readonly name = "AppointmentPaidEvent";
	constructor(public readonly appointmentId: string) {}
}
