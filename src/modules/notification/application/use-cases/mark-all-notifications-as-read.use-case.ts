import { Injectable, Logger } from "@nestjs/common";
import { NotificationRepository } from "../../domain/interfaces/notification.repository.interface";

interface MarkAllNotificationsAsReadRequest {
	userId: string;
}

@Injectable()
export class MarkAllNotificationsAsReadUseCase {
	private readonly logger = new Logger(MarkAllNotificationsAsReadUseCase.name);

	constructor(
		private readonly notificationRepository: NotificationRepository,
	) {}

	async execute(request: MarkAllNotificationsAsReadRequest): Promise<void> {
		this.logger.log(
			`Marking all notifications as read for user: ${request.userId}`,
		);

		try {
			await this.notificationRepository.markAllAsRead(request.userId);

			this.logger.log(
				`All notifications marked as read for user: ${request.userId}`,
			);
		} catch (error) {
			this.logger.error(
				`Failed to mark all notifications as read for user: ${request.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
