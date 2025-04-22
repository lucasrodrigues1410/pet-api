import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import { NotificationRepository } from "@/modules/notification/domain/interfaces/notification.repository.interface";
import { PrismaNotificationMapper } from "../mappers/prisma-notification.mapper";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async create(notification: Notification): Promise<void> {
		const persistenceNotification =
			PrismaNotificationMapper.toPrisma(notification);
		await this.prismaService.notification.create({
			data: persistenceNotification,
		});
	}

	async findByUserId(userId: string) {
        const notifications = await this.prismaService.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return notifications.map((notification) =>
            PrismaNotificationMapper.toDomain(notification),
        );
    }

	async markAsRead(notificationId: string) {
        await this.prismaService.notification.update({
            where: { id: notificationId },
            data: { read: true },
        }); 
    }

	async delete(notificationId: string): Promise<void> {
        await this.prismaService.notification.delete({
            where: { id: notificationId },
        });
    }
}
