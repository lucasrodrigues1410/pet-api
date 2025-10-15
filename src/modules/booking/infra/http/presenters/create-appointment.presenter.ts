export class CreateAppointmentPresenter {
	static present({
		appointmentId,
		clientSecret,
		checkoutUrl,
	}: {
		appointmentId: string;
		clientSecret?: string;
		checkoutUrl?: string;
	}) {
		return { appointmentId, clientSecret, checkoutUrl};
	}
}
