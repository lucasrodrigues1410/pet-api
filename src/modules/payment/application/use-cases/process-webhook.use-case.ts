import { Injectable, Logger } from "@nestjs/common";
import { PaymentWebhookEvent } from "../../domain/events/payment-webhook.event";
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
			const event = this.paymentGateway.constructEvent(
				input.payload,
				input.signature,
			);

			this.logger.log(`Received webhook: ${event.id} at ${event.createdAt}`);

			const job: PaymentWebhookEvent = {
				id: event.id,
				data: event.data.object as unknown as Record<string, any>,
				timestamp: event.createdAt.getTime(),
			};

			await this.paymentQueue.dispatch(job);

			this.logger.log(
				`Webhook job added to queue: ${event.id} - ${event.data.id}`,
			);
		} catch (error) {
			this.logger.error("Failed to process webhook", error);
			throw error;
		}
	}
}
