import { Injectable, Logger } from "@nestjs/common";
import { Notification } from "../../domain/entities/notification.entity";
import {
	NotificationRepository,
	PaginatedResult,
	PaginationOptions,
} from "../../domain/interfaces/notification.repository.interface";

interface GetUserNotificationsRequest {
	userId: string;
	pagination?: PaginationOptions;
}

@Injectable()
export class GetUserNotificationsUseCase {
	private readonly logger = new Logger(GetUserNotificationsUseCase.name);

	constructor(
		private readonly notificationRepository: NotificationRepository,
	) {}

	async execute(
		request: GetUserNotificationsRequest,
	): Promise<PaginatedResult<Notification>> {
		this.logger.log(`Fetching notifications for user: ${request.userId}`);

		try {
			const result = await this.notificationRepository.findByUserIdPaginated(
				request.userId,
				request.pagination,
			);

			this.logger.log(
				`Retrieved ${result.data.length} notifications for user: ${request.userId} (total: ${result.total})`,
			);

			return result;
		} catch (error) {
			this.logger.error(
				`Failed to fetch notifications for user: ${request.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
