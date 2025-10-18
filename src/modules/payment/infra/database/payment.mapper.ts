import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Payment } from "../../domain/entities/payment.entity";

export class PaymentMapper {
	static toDomain(raw: any): Payment {
		return Payment.create(
			{
				appointmentId: new UniqueEntityID(raw.appointmentId),
				amount: raw.amount,
				status: raw.status,
				externalId: raw.externalId,
				externalMetadata: raw.externalMetadata,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(payment: Payment) {
		return {
			id: payment.id.toString(),
			appointmentId: payment.appointmentId.toString(),
			amount: payment.amount,
			status: payment.status,
			externalId: payment.externalId,
			externalMetadata: payment.externalMetadata
				? JSON.parse(JSON.stringify(payment.externalMetadata))
				: undefined,
			createdAt: payment.createdAt,
			updatedAt: payment.updatedAt,
			deletedAt: null,
		};
	}
}
