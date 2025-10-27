import { Prisma } from "prisma/generated/browser";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Payment } from "../../domain/entities/payment.entity";

export class PrismaPaymentMapper {
	static toDomain(raw: any): Payment {
		return Payment.create(
			{
				appointmentId: new UniqueEntityID(raw.appointmentId),
				amount: raw.amount,
				status: raw.status,
				externalId: raw.externalId,
				externalMetadata: raw.externalMetadata,
				checkoutUrl: raw.checkoutUrl,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(payment: Payment): Prisma.PaymentUncheckedCreateInput {
		return {
			id: payment.id.toString(),
			appointmentId: payment.appointmentId.toString(),
			amount: payment.amount,
			status: payment.status,
			externalId: payment.externalId,
			checkoutUrl: payment.checkoutUrl,
			createdAt: payment.createdAt,
			updatedAt: payment.updatedAt,
			deletedAt: null,
		};
	}
}
