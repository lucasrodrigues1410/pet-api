import { Payment } from "../entities/payment.entity";

export abstract class PaymentRepository {
	abstract create(payment: Payment): Promise<void>;
}
