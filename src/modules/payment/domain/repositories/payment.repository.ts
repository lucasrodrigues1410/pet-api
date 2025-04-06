import { Payment, PaymentProps } from "../entities/payment.entity";

export abstract class PaymentRepository {
	abstract create(payment: Payment): Promise<void>;
	abstract findById(id: string): Promise<Payment | null>;
	abstract update(id: string, payment: Partial<PaymentProps>): Promise<void>;
}
