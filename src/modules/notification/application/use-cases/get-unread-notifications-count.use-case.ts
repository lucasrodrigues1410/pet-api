import { Injectable, Logger } from "@nestjs/common";
import { NotificationRepository } from "../../domain/interfaces/notification.repository.interface";

interface GetUnreadNotificationsCountRequest {
	userId: string;
}

interface GetUnreadNotificationsCountResponse {
	count: number;
}

@Injectable()
export class GetUnreadNotificationsCountUseCase {
	private readonly logger = new Logger(GetUnreadNotificationsCountUseCase.name);

	constructor(
		private readonly notificationRepository: NotificationRepository,
	) {}

	async execute(
		request: GetUnreadNotificationsCountRequest,
	): Promise<GetUnreadNotificationsCountResponse> {
		this.logger.log(
			`Getting unread notifications count for user: ${request.userId}`,
		);

		try {
			const count = await this.notificationRepository.countUnreadByUserId(
				request.userId,
			);

			this.logger.log(
				`User ${request.userId} has ${count} unread notifications`,
			);

			return { count };
		} catch (error) {
			this.logger.error(
				`Failed to get unread notifications count for user: ${request.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
