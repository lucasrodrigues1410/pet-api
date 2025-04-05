import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PaymentWebhookReceivedEvent } from "@/modules/payment/application/events/payment-webhook-received.event"; // Importa a definição do evento
import { ConfirmPaymentAndSchedulingUseCase } from "../use-cases/confirm-payment-and-scheduling.use-case";

@Injectable()
export class PaymentEventListener {
	private readonly logger = new Logger(PaymentEventListener.name);

	constructor(
		private readonly confirmPaymentAndSchedulingUseCase: ConfirmPaymentAndSchedulingUseCase,
	) {}

	@OnEvent(PaymentWebhookReceivedEvent.EVENT_NAME, { async: true })
	async handlePaymentWebhookReceived(event: PaymentWebhookReceivedEvent) {
		this.logger.log(
			`Received event: ${PaymentWebhookReceivedEvent.EVENT_NAME} for payment ${event.gatewayPaymentId}, type: ${event.webhookEventType}`,
		);

		switch (event.webhookEventType) {
			case "payment_intent.succeeded":
				if (!event.appointmentIntentId) {
					this.logger.warn(
						`Cannot process scheduling confirmation for payment ${event.gatewayPaymentId}: Missing appointmentIntentId.`,
					);
					return;
				}

				try {
					this.logger.log(
						`Executing ConfirmPaymentAndSchedulingUseCase for payment ${event.gatewayPaymentId}`,
					);
					await this.confirmPaymentAndSchedulingUseCase.execute({
						scheduleData: {
							appointmentIntentId: event.appointmentIntentId,
						},
					});
					this.logger.log(
						`Successfully processed scheduling confirmation for payment ${event.gatewayPaymentId}`,
					);
				} catch (error) {
					this.logger.error(
						`Error processing event for payment ${event.gatewayPaymentId}: ${error.message}`,
						error.stack,
					);
					// TODO: Implementar estratégias de retry ou notificação de falha se necessário
				}
				break;

			case "payment_intent.payment_failed":
				this.logger.log(
					`Payment failed for intent associated with payment ${event.gatewayPaymentId}.`,
				);
				break;
			default:
				this.logger.log(
					`Ignoring unhandled webhook event type: ${event.webhookEventType}`,
				);
		}
	}
}
