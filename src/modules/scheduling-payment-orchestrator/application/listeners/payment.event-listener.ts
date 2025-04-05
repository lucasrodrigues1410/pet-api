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

		if (
			event.webhookEventType === "checkout.session.completed" &&
			"appointmentIntentId" in event.metadata &&
			String(event.metadata.appointmentIntentId).length > 0
		) {
			try {
				this.logger.log(
					`Executing ConfirmPaymentAndSchedulingUseCase for payment ${event.gatewayPaymentId}`,
				);
				await this.confirmPaymentAndSchedulingUseCase.execute({
					scheduleData: {
						appointmentIntentId: event.metadata.appointmentIntentId,
					},
				});
				this.logger.log(
					`Successfully processed scheduling confirmation for payment ${event.gatewayPaymentId}`,
				);
			} catch (error) {
				this.logger.error(
					`Error processing event for payment ${event.gatewayPaymentId}: ${(error as Error).message}`,
					(error as Error).stack,
				);
				// TODO: Implementar estratégias de retry ou notificação de falha se necessário
			}
		}
	}
}
