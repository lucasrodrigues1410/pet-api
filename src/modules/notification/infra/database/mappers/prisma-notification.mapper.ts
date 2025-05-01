import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import { Notification as PrismaNotification } from "@/prisma-generated/client";

export class PrismaNotificationMapper {
	static toDomain(raw: PrismaNotification): Notification {
		const notification = Notification.create(
			{
				userId: new UniqueEntityID(raw.userId),
				type: raw.type,
				message: raw.message,
				read: raw.read,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt ?? undefined,
			},
			new UniqueEntityID(raw.id),
		);

		return notification;
	}

	static toPrisma(notification: Notification): PrismaNotification {
		return {
			id: notification.id.toString(),
			userId: notification.userId.toString(),
			type: notification.type,
			message: notification.message,
			read: notification.read,
			createdAt: notification.createdAt,
			updatedAt: notification.updatedAt ?? null,
		};
	}
}
