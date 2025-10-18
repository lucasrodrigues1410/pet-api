import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DomainError } from "@/core/domain/errors/domain-error";

export const paymentStatus = [
	"pending",
	"succeeded",
	"expired",
	"failed",
] as const;

export type PaymentStatus = (typeof paymentStatus)[number];

export interface PaymentProps {
	appointmentId: UniqueEntityID;
	amount: number;
	status: PaymentStatus;
	externalId?: string;
	clientSecret?: string;
	checkoutUrl?: string;
	externalMetadata?: Record<string, string>;
	createdAt?: Date;
	updatedAt?: Date;
}

export class Payment extends Entity<PaymentProps> {
	private static readonly PROCESSABLE_STATUSES: PaymentStatus[] = [
		"pending",
		"expired",
		"failed",
	];

	get appointmentId() {
		return this.props.appointmentId;
	}

	get amount() {
		return this.props.amount;
	}

	get status() {
		return this.props.status;
	}

	get clientSecret() {
		return this.props.clientSecret;
	}

	get externalId() {
		return this.props.externalId;
	}

	get checkoutUrl() {
		return this.props.checkoutUrl;
	}

	get externalMetadata() {
		return this.props.externalMetadata;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	public setExternalId(externalId: string): void {
		this.props.externalId = externalId;
		this.touch();
	}

	public setCheckoutUrl(checkoutUrl: string): void {
		this.props.checkoutUrl = checkoutUrl;
		this.touch();
	}

	public setExternalMetadata(metadata: Record<string, string>): void {
		this.props.externalMetadata = {
			...this.props.externalMetadata,
			...metadata,
		};
		this.touch();
	}

	public markAsSucceeded(): void {
		if (this.props.status !== "pending") {
			throw new DomainError("Only pending payments can succeed");
		}

		this.props.status = "succeeded";
		this.touch();
	}

	public markAsFailed(): void {
		if (this.props.status !== "pending") {
			throw new DomainError("Only pending payments can be failed");
		}

		this.props.status = "failed";
		this.touch();
	}

	public markAsExpired(): void {
		if (this.props.status !== "pending") {
			throw new DomainError("Only pending payments can be expired");
		}

		this.props.status = "expired";
		this.touch();
	}

	public setClientSecret(clientSecret: string): void {
		this.props.clientSecret = clientSecret;
		this.touch();
	}

	public canBeProcessed(): boolean {
		return Payment.PROCESSABLE_STATUSES.includes(this.props.status);
	}

	private touch(): void {
		this.props.updatedAt = new Date();
	}

	public static create(
		props: Omit<PaymentProps, "status" | "createdAt" | "updatedAt"> & {
			status?: PaymentStatus;
		},
		id?: UniqueEntityID,
	): Payment {
		if (props.amount <= 0) {
			throw new DomainError("Payment amount must be positive");
		}

		const now = new Date();

		return new Payment(
			{
				...props,
				status: props.status ?? "pending",
				createdAt: now,
				updatedAt: now,
			},
			id,
		);
	}
}
