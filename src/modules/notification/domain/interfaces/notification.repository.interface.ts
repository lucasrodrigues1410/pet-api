import { Notification } from "../entities/notification.entity";

export interface PaginationOptions {
	page?: number;
	limit?: number;
	onlyUnread?: boolean;
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export abstract class NotificationRepository {
	abstract create(notification: Notification): Promise<void>;
	abstract findByUserId(userId: string): Promise<Notification[]>;
	abstract findByUserIdPaginated(
		userId: string,
		options?: PaginationOptions,
	): Promise<PaginatedResult<Notification>>;
	abstract markAsRead(notificationId: string): Promise<void>;
	abstract markAllAsRead(userId: string): Promise<void>;
	abstract delete(notificationId: string): Promise<void>;
	abstract countUnreadByUserId(userId: string): Promise<number>;
}
