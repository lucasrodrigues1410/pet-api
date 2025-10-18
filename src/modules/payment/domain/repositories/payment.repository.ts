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
	abstract save(payment: Payment, tx?: any): Promise<void>;
	abstract delete(id: string, tx?: any): Promise<void>;
}
