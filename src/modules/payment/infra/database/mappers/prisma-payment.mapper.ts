import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	Payment,
	PaymentStatus,
	PaymentType,
} from "@/modules/payment/domain/entities/payment.entity";
import { Prisma, Payment as PrismaPayment } from "@prisma/client";

export class PrismaPaymentMapper {
	static toDomain(prismaPayment: PrismaPayment): Payment {
		return Payment.create(
			{
				amount: Number(prismaPayment.amount),
				status: prismaPayment.status as PaymentStatus,
				type: prismaPayment.type as PaymentType,
				gatewayPaymentIntentId:
					prismaPayment.gatewayPaymentIntentId ?? undefined,
				payerId: prismaPayment.payerId ?? undefined,
			},
			new UniqueEntityID(prismaPayment.id),
		);
	}

	static toPersistence(payment: Payment): Prisma.PaymentUncheckedCreateInput {
		return {
			id: payment.id.toString(),
			amount: Prisma.Decimal(payment.amount),
			status: payment.status,
			type: payment.type,
			payerId: payment.payerId,
		};
	}
}
