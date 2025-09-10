import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import {
	NotificationRepository,
	PaginatedResult,
	PaginationOptions,
} from "@/modules/notification/domain/interfaces/notification.repository.interface";
import { PrismaNotificationMapper } from "../mappers/prisma-notification.mapper";

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

	async findByUserId(userId: string): Promise<Notification[]> {
		const notifications = await this.prismaService.notification.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		return notifications.map((notification) =>
			PrismaNotificationMapper.toDomain(notification),
		);
	}

	async findByUserIdPaginated(
		userId: string,
		options: PaginationOptions = {},
	): Promise<PaginatedResult<Notification>> {
		const { page = 1, limit = 10, onlyUnread = false } = options;
		const skip = (page - 1) * limit;

		const where = { userId, ...(onlyUnread && { read: false }) };

		const [notifications, total] = await Promise.all([
			this.prismaService.notification.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			this.prismaService.notification.count({ where }),
		]);

		return {
			data: notifications.map((notification) =>
				PrismaNotificationMapper.toDomain(notification),
			),
			total,
			page,
			limit,
		};
	}

	async markAsRead(notificationId: string): Promise<void> {
		await this.prismaService.notification.update({
			where: { id: notificationId },
			data: { read: true, updatedAt: new Date() },
		});
	}

	async markAllAsRead(userId: string): Promise<void> {
		await this.prismaService.notification.updateMany({
			where: { userId, read: false },
			data: { read: true, updatedAt: new Date() },
		});
	}

	async delete(notificationId: string): Promise<void> {
		await this.prismaService.notification.delete({
			where: { id: notificationId },
		});
	}

	async countUnreadByUserId(userId: string): Promise<number> {
		return await this.prismaService.notification.count({
			where: { userId, read: false },
		});
	}
}
