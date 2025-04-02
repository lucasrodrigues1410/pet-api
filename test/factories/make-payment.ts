import {
	Payment,
	PaymentProps,
	PaymentStatus,
	PaymentType,
} from "@/modules/payment/domain/entities/payment.entity";
import { PrismaPaymentMapper } from "@/modules/payment/infra/database/mappers/prisma-payment.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Animal,
	AnimalProps,
} from "src/modules/animal/domain/entities/animal.entity";
import { AnimalPrismaMapper } from "src/modules/animal/infra/database/mappers/prisma-animal.mapper";

export function makePayment(
	override: Partial<Payment> = {},
	id?: UniqueEntityID,
) {
	const payment = Payment.create(
		{
			gatewayPaymentIntentId: faker.string.uuid(),
			amount: faker.number.float({ min: 1, max: 100 }),
			payerId: faker.string.uuid(),
			status: faker.helpers.enumValue(PaymentStatus),
			type: faker.helpers.enumValue(PaymentType),
			...override,
		},
		id,
	);

	return payment;
}

@Injectable()
export class PaymentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaPayment(data: Partial<PaymentProps> = {}): Promise<Payment> {
		const payment = makePayment(data);

		await this.prisma.payment.create({
			data: PrismaPaymentMapper.toPersistence(payment),
		});

		return payment;
	}
}
