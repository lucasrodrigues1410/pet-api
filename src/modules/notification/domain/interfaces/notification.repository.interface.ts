import { Notification } from "../entities/notification.entity";

export abstract class NotificationRepository {
	abstract create(notification: Notification): Promise<void>;
	abstract findByUserId(userId: string): Promise<any[]>;
	abstract markAsRead(notificationId: string): Promise<void>;
	abstract delete(notificationId: string): Promise<void>;
}
