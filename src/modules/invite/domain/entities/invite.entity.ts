import { randomUUIDv7 } from "bun";
import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface InviteProps {
	userId: UniqueEntityID;
	token: string;
	expiresAt: Date;
	usedAt?: Date;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export class Invite extends Entity<InviteProps> {
	get userId() {
		return this.props.userId;
	}

	get token() {
		return this.props.token;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get usedAt() {
		return this.props.usedAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get deletedAt() {
		return this.props.deletedAt;
	}

	public static create(
		props: Omit<
			InviteProps,
			"createdAt" | "updatedAt" | "deletedAt" | "token"
		> & {
			createdAt?: Date;
			updatedAt?: Date;
			deletedAt?: Date;
			token?: string;
		},
		id?: UniqueEntityID,
	): Invite {
		return new Invite(
			{
				...props,
				token: props.token ?? randomUUIDv7(),
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
				deletedAt: props.deletedAt ?? undefined,
			},
			id,
		);
	}

	public markAsUsed(): void {
		this.props.usedAt = new Date();
		this.props.updatedAt = new Date();
	}

	public isExpired(now: Date): boolean {
		return this.props.expiresAt < now;
	}

	public isUsed(): boolean {
		return !!this.props.usedAt;
	}

	public toObject() {
		return {
			id: this.id.toString(),
			userId: this.userId.toString(),
			token: this.token,
			expiresAt: this.expiresAt,
			usedAt: this.usedAt,
		};
	}
}
