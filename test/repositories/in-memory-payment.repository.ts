import { Payment } from "@/modules/payment/domain/entities/payment.entity";
import { PaymentRepository } from "@/modules/payment/domain/repositories/payment.repository";

export class InMemoryPaymentRepository implements PaymentRepository {
	public items: Payment[] = [];

	async create(payment: Payment) {
		this.items.push(payment);
	}
}
