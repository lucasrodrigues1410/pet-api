import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Payment } from "@/modules/payment/domain/entities/payment.entity";
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
}
