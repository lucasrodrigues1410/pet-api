import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { InvalidWebhookSignatureError } from "@/modules/payment/domain/errors/invalid-webhook-signature.error";
import { PaymentWebhookReceivedEvent } from "@/modules/payment/domain/events/payment-webhook-received.event";
import { PaymentGateway } from "@/modules/payment/domain/repositories/payment-gateway.repository";
import {
	Controller,
	Headers,
	HttpCode,
	HttpException,
	HttpStatus,
	Logger,
	Post,
	type RawBodyRequest,
	Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { PaymentQueue } from "../../queue/payment.queue";

@ApiTags("Pagamentos - Webhook")
@Controller("payments/webhook")
export class StripeWebhookController {
	private readonly logger = new Logger(StripeWebhookController.name);

	constructor(
		private readonly paymentGateway: PaymentGateway,
		private readonly paymentQueue: PaymentQueue,
	) {}

	@ApiOperation({
		summary: "Stripe Webhook",
		description:
			"Handles Stripe webhook events. Validates the signature and processes the event.",
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post("stripe")
	@Public()
	async handleStripeWebhook(
		@Headers("stripe-signature") signature: string,
		@Req() req: RawBodyRequest<Request>,
	) {
		this.logger.log("Stripe webhook received.");

		if (!signature) {
			throw new HttpException(
				"Missing stripe-signature header",
				HttpStatus.BAD_REQUEST,
			);
		}

		const verificationResult = await this.paymentGateway.verifyAndParseWebhook({
			signature,
			payload: req.rawBody as Buffer,
		});

		if (verificationResult.isLeft()) {
			throw new HttpException(
				"Webhook verification error",
				HttpStatus.BAD_REQUEST,
			);
		}

		const { type, payload } = verificationResult.value;
		if (type === "checkout.session.completed" && payload) {
			const eventPayload = new PaymentWebhookReceivedEvent(
				payload.amount,
				payload.metadata,
				type,
			);

			this.logger.log(
				`Emitting event: ${type} for payment ${payload?.gatewayPaymentId}`,
			);
			this.paymentQueue.addPaymentWebhookJob(eventPayload);
		}
	}
}
