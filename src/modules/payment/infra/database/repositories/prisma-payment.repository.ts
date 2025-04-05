import { PrismaService } from "@/core/infra/prisma/prisma.service";
import {
	Payment,
	PaymentProps,
} from "@/modules/payment/domain/entities/payment.entity";
import { PaymentRepository } from "@/modules/payment/domain/repositories/payment.repository";
import { Injectable } from "@nestjs/common";
import { PrismaPaymentMapper } from "../mappers/prisma-payment.mapper";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
	constructor(private prismaService: PrismaService) {}

	async create(payment: Payment) {
		await this.prismaService.payment.create({
			data: PrismaPaymentMapper.toPersistence(payment),
		});
	}

	async findById(id: string) {
		const payment = await this.prismaService.payment.findUnique({
			where: { id },
		});

		if (!payment) {
			return null;
		}

		return PrismaPaymentMapper.toDomain(payment);
	}

	async update(id: string, payment: Partial<PaymentProps>) {
		await this.prismaService.payment.update({
			where: { id },
			data: payment,
		});
	}
}
