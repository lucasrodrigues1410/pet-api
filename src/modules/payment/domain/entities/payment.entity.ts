import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export enum PaymentStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	FAILED = "FAILED",
	REFUNDED = "REFUNDED",
	CANCELED = "CANCELED",
}

export enum PaymentType {
	ONE_TIME = "ONE_TIME",
	RECURRING = "RECURRING",
}

export const PaymentStatusValues = Object.values(PaymentStatus);
export const PaymentTypeValues = Object.values(PaymentType);

export interface PaymentProps {
	amount: number;
	status: PaymentStatus;
	type: PaymentType;
	gatewayPaymentIntentId?: string;
}

export class Payment extends Entity<PaymentProps> {
	get amount() {
		return this.props.amount;
	}

	get status() {
		return this.props.status;
	}

	get type() {
		return this.props.type;
	}

	get gatewayPaymentIntentId() {
		return this.props.gatewayPaymentIntentId;
	}

	static create(
		props: Omit<PaymentProps, "status" | "type"> & {
			status?: PaymentStatus;
			type?: PaymentType;
		},
		id?: UniqueEntityID,
	) {
		return new Payment(
			{
				...props,
				status: props.status || PaymentStatus.PENDING,
				type: props.type || PaymentType.ONE_TIME,
			},
			id,
		);
	}
}
