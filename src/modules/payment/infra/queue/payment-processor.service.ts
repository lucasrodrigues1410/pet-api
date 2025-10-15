import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Job } from "bullmq";
import { Stripe } from "stripe";
import { AppointmentExpiredPaymentEvent } from "@/modules/appointment/domain/events/appointment-expired-payment.event copy";
import { AppointmentPaidEvent } from "@/modules/appointment/domain/events/appointment-paid.event";
import { HandlePaymentChangeStatusUseCase } from "../../application/use-cases/handle-payment-change-status.use-case";
import { PaymentWebhookEvent } from "../../domain/events/payment-webhook.event";

@Processor("payments")
@Injectable()
export class BullPaymentWebhookProcessor extends WorkerHost {
	private readonly logger = new Logger(BullPaymentWebhookProcessor.name);

	constructor(
		private readonly changeStatusUseCase: HandlePaymentChangeStatusUseCase,
		private readonly eventEmitter: EventEmitter2,
	) {
		super();
	}

	async process(job: Job<PaymentWebhookEvent<Stripe.Event>>) {
		const { id, data } = job.data;

		this.logger.log(
			`Processing webhook job: ${id} (attempt ${job.attemptsMade + 1})`,
		);

		try {
			switch (data.type) {
				case "checkout.session.completed": {
					const { metadata, payment_intent } =
						data.object as unknown as Stripe.Checkout.Session;
					await this.changeStatusUseCase.execute({
						externalPaymentId: payment_intent as string,
						status: "succeeded",
					});
					if (!metadata?.appointmentId) {
						this.logger.warn(
							`No appointmentId found in session metadata for paymentIntentId: ${payment_intent}`,
						);
						return;
					}
					await this.eventEmitter.emit(
						AppointmentPaidEvent.name,
						new AppointmentPaidEvent(metadata?.appointmentId),
					);
					break;
				}

				case "checkout.session.expired":
				case "payment_intent.payment_failed": {
					const { metadata, id } =
						data.object as unknown as Stripe.PaymentIntent;
					const status =
						data.type === "checkout.session.expired" ? "canceled" : "failed";
					await this.changeStatusUseCase.execute({
						externalPaymentId: id,
						status,
					});
					if (!metadata?.appointmentId) {
						this.logger.warn(
							`No appointmentId found in session metadata for paymentIntentId: ${id}`,
						);
						return;
					}
					if (status === "canceled") {
						await this.eventEmitter.emit(
							AppointmentExpiredPaymentEvent.name,
							new AppointmentExpiredPaymentEvent(metadata?.appointmentId),
						);
					}
					break;
				}
				default:
					this.logger.log(`Ignoring unsupported event type: ${data.type}`);
					return;
			}
			this.logger.log(`Webhook processed successfully: ${id} - ${data.type}`);
		} catch (error) {
			this.logger.error(
				`Failed to process webhook: ${id} - ${data.type}`,
				error,
			);
			throw error;
		}
	}
}
