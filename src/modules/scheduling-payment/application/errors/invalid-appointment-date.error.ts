export class InvalidAppointmentDateError extends Error {
	constructor() {
		super("A data deve ser maior ou igual a hoje");
		this.name = "InvalidAppointmentDateError";
	}
}
