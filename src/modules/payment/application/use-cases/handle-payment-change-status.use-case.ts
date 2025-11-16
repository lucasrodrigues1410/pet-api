import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaymentStatus } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

type HandlePaymentChangeStatusInput = {
	externalPaymentId: string;
	status: PaymentStatus;
};
type HandlePaymentChangeStatusOutput = Either<Error, void>;

@Injectable()
export class HandlePaymentChangeStatusUseCase {
	constructor(private readonly paymentRepository: PaymentRepository) {}

	async execute(
		input: HandlePaymentChangeStatusInput,
	): Promise<HandlePaymentChangeStatusOutput> {
		const payment = await this.paymentRepository.findByExternalId(
			input.externalPaymentId,
		);

		if (!payment) {
			return left(new ResourceNotFoundError("Payment not found"));
		}

		if (payment.status === input.status) return right(void 0);

		switch (input.status) {
			case "succeeded":
				payment.markAsSucceeded();
				break;
			case "failed":
				payment.markAsFailed();
				break;
			case "expired":
				payment.markAsExpired();
				break;
			default:
				return left(new Error("Invalid status"));
		}

		await this.paymentRepository.update(payment);
		return right(void 0);
	}
}
