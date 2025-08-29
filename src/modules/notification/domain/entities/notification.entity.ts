import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export const notificationType = [
	"user_created",
	"appointment_status_changed",
] as const;
export type NotificationType = (typeof notificationType)[number];

export interface NotificationProps {
	userId: UniqueEntityID;
	type: NotificationType;
	message: string;
	read: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
	get userId() {
		return this.props.userId;
	}

	get type() {
		return this.props.type;
	}

	get message() {
		return this.props.message;
	}

	get read() {
		return this.props.read;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	public static create(
		props: Omit<NotificationProps, "createdAt"> & {
			createdAt?: Date;
		},
		id?: UniqueEntityID,
	): Notification {
		const notification = new Notification(
			{
				...props,
				updatedAt: props.updatedAt ?? new Date(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return notification;
	}
}
