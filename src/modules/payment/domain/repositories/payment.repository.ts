import { Payment } from "../entities/payment.entity";

export abstract class PaymentRepository {
	abstract findById(id: string, tx?: any): Promise<Payment | null>;
	abstract findByAppointmentId(
		appointmentId: string,
		tx?: any,
	): Promise<Payment | null>;
	abstract findByExternalId(
		externalId: string,
		tx?: any,
	): Promise<Payment | null>;
	abstract create(payment: Payment): Promise<void>;
	abstract update(payment: Payment): Promise<void>;
	abstract delete(id: string, tx?: any): Promise<void>;
}
