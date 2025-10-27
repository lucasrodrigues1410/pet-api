import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { PrismaPaymentMapper } from "./payment.mapper";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
	constructor(private readonly prisma: PrismaService) {}
	async findById(
		id: string,
		tx?: Prisma.TransactionClient,
	): Promise<Payment | null> {
		const payment = await (tx || this.prisma).payment.findUnique({
			where: { id },
		});
		if (!payment) return null;
		return PrismaPaymentMapper.toDomain(payment);
	}

	async findByAppointmentId(
		appointmentId: string,
		tx?: Prisma.TransactionClient,
	): Promise<Payment | null> {
		const payment = await (tx || this.prisma).payment.findFirst({
			where: { appointmentId },
		});
		if (!payment) return null;
		return PrismaPaymentMapper.toDomain(payment);
	}

	async findByExternalId(
		externalId: string,
		tx?: Prisma.TransactionClient,
	): Promise<Payment | null> {
		const payment = await (tx || this.prisma).payment.findFirst({
			where: { externalId },
		});
		if (!payment) return null;
		return PrismaPaymentMapper.toDomain(payment);
	}

	async save(payment: Payment): Promise<void> {
		const data = PrismaPaymentMapper.toPersistence(payment);
		await this.prisma.payment.create({ data });
	}

	async delete(id: string): Promise<void> {
		await this.prisma.payment.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
