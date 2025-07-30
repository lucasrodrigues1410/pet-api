import {
	Payment,
	PaymentProps,
} from "@/modules/payment/domain/entities/payment.entity";
import { PaymentRepository } from "@/modules/payment/domain/repositories/payment.repository";

export class InMemoryPaymentRepository implements PaymentRepository {
	public items: Payment[] = [];

	async create(payment: Payment) {
		this.items.push(payment);
	}

	async findById(id: string) {
		const payment = this.items.find((payment) => payment.id.toString() === id);
		return payment || null;
	}

	async update(_: string, _1: Partial<PaymentProps>) {
		throw new Error("Not implemented");
	}
}
