export class SendUserCreatedNotificationCommand {
	constructor(
		public readonly userId: string,
		public readonly email: string,
		public readonly name: string,
	) {}
}
