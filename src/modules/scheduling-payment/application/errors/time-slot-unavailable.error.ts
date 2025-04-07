export class TimeSlotUnavailableError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "TimeSlotUnavailableError";
	}
}
