import { Injectable, Logger } from "@nestjs/common";
import { PaymentGateway } from "../../domain/gateways/payment-gateway";
import { PaymentWebhookDispatcher } from "../../domain/interfaces/payment-webhook-dispatcher.interface";

export interface ProcessWebhookInput {
	payload: unknown;
	signature: string;
}

@Injectable()
export class ProcessWebhookUseCase {
	private readonly logger = new Logger(ProcessWebhookUseCase.name);

	constructor(
		private readonly paymentGateway: PaymentGateway,
		private readonly paymentQueue: PaymentWebhookDispatcher,
	) {}

	async execute(input: ProcessWebhookInput): Promise<void> {
		try {
			const event = await this.paymentGateway.constructEvent(
				input.payload,
				input.signature,
			);

			this.logger.log(`Received webhook: ${event.id} at ${event.createdAt}`);

			await this.paymentQueue.dispatch({ id: event.id, data: event.data });
			this.logger.log(
				`Webhook job added to queue: ${event.id} - ${event.data.id}`,
			);
		} catch (error) {
			this.logger.error("Failed to process webhook", error);
			throw error;
		}
	}
}
