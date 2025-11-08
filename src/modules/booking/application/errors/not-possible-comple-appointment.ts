export class NotPossibleCompleteAppointmentError extends Error {
	constructor(msg?: string) {
		super(msg || "Não é possível completar o agendamento.");
		this.name = "NotPossibleCompleteAppointmentError";
	}
}
