import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { PaymentWebhookReceivedEvent } from "@/modules/payment/application/events/payment-webhook-received.event";
import { InvalidWebhookSignatureError } from "@/modules/payment/domain/errors/invalid-webhook-signature.error";
import { PaymentGateway } from "@/modules/payment/domain/repositories/payment-gateway.repository";
import {
	Controller,
	Headers,
	HttpException,
	HttpStatus,
	Logger,
	Post,
	RawBodyRequest,
	Req,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("Pagamentos - Webhook")
@Controller("payments/webhook")
export class StripeWebhookController {
	private readonly logger = new Logger(StripeWebhookController.name);

	constructor(
		private readonly paymentGateway: PaymentGateway,
		private eventEmitter: EventEmitter2,
	) {}

	@ApiOperation({
		summary: "Stripe Webhook",
		description:
			"Handles Stripe webhook events. Validates the signature and processes the event.",
	})
	@Post("stripe")
	@Public()
	async handleStripeWebhook(
		@Headers("stripe-signature") signature: string,
		@Req() req: any,
	) {
		this.logger.log("Stripe webhook received.");

		if (!signature) {
			this.logger.warn("Missing stripe-signature header.");
			throw new HttpException(
				"Missing stripe-signature header",
				HttpStatus.BAD_REQUEST,
			);
		}

		const verificationResult = await this.paymentGateway.verifyAndParseWebhook({
			signature,
			payload: req.rawBody,
		});

		if (verificationResult.isLeft()) {
			const error = verificationResult.value;
			if (error instanceof InvalidWebhookSignatureError) {
				this.logger.warn("Invalid webhook signature.");
				throw new HttpException(
					"Invalid webhook signature",
					HttpStatus.UNAUTHORIZED,
				);
			}

			this.logger.error(
				`Webhook verification failed: ${(error as Error).message}`,
			);
			throw new HttpException(
				"Webhook verification error",
				HttpStatus.BAD_REQUEST,
			);
		}

		const { type, payload } = verificationResult.value;
		this.logger.log(`Webhook event type received: ${type}`);

		if (payload) {
			// Cria a instância do evento com todos os dados relevantes
			const eventPayload = new PaymentWebhookReceivedEvent(
				"stripe",
				payload.gatewayPaymentId,
				payload.amount,
				payload.currency,
				payload.status,
				payload.paidAt,
				payload.metadata,
				type,
			);

			try {
				this.logger.log(
					`Emitting event: ${PaymentWebhookReceivedEvent.EVENT_NAME} for payment ${payload.gatewayPaymentId}`,
				);
				this.eventEmitter.emit(
					PaymentWebhookReceivedEvent.EVENT_NAME,
					eventPayload,
				);
				return { received: true, processed: true };
			} catch (e) {
				const error = e as Error;
				this.logger.error(
					`Failed to emit event ${PaymentWebhookReceivedEvent.EVENT_NAME}: ${error.message}`,
					error.stack,
				);
				throw new HttpException(
					"Error processing payment",
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		} else {
			this.logger.log(
				`Webhook event type ${type} received without relevant payload data. Ignoring.`,
			);
		}

		this.logger.log(
			"Webhook processed successfully, returning 200 OK to Stripe.",
		);
		return { received: true };
	}
}
