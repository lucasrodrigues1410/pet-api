import { Injectable, Logger } from "@nestjs/common";
import { NotificationRepository } from "../../domain/interfaces/notification.repository.interface";

interface MarkNotificationAsReadRequest {
	notificationId: string;
	userId?: string; // Para logs de auditoria
}

@Injectable()
export class MarkNotificationAsReadUseCase {
	private readonly logger = new Logger(MarkNotificationAsReadUseCase.name);

	constructor(
		private readonly notificationRepository: NotificationRepository,
	) {}

	async execute(request: MarkNotificationAsReadRequest): Promise<void> {
		this.logger.log(
			`Marking notification as read: ${request.notificationId}${request.userId ? ` for user: ${request.userId}` : ""}`,
		);

		try {
			await this.notificationRepository.markAsRead(request.notificationId);

			this.logger.log(`Notification marked as read: ${request.notificationId}`);
		} catch (error) {
			this.logger.error(
				`Failed to mark notification as read: ${request.notificationId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
