import { Controller, Headers, Post, type RawBodyRequest, Req } from "@nestjs/common";
import { ProcessWebhookUseCase } from "../../application/use-cases/process-webhook.use-case";

@Controller("webhooks/payment")
export class PaymentWebhookController {
	constructor(private readonly processWebhookUseCase: ProcessWebhookUseCase) {}

	@Post("stripe")
	async handleStripeWebhook(
		@Req() req: RawBodyRequest<Request>,
		@Headers("stripe-signature") signature: string,
	) {
		const payload = req.rawBody;
		await this.processWebhookUseCase.execute({
			payload,
			signature,
		});
	}
}
