import {
	Controller,
	Headers,
	Post,
	type RawBodyRequest,
	Req,
} from "@nestjs/common";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { ProcessWebhookUseCase } from "../../application/use-cases/process-webhook.use-case";

@Controller("webhook/payment")
export class PaymentWebhookController {
	constructor(private readonly processWebhookUseCase: ProcessWebhookUseCase) {}

	@Public()
	@Post("stripe")
	async handleStripeWebhook(
		@Req() req: RawBodyRequest<Request>,
		@Headers("stripe-signature") signature: string,
	) {
		const payload = req.rawBody;
		await this.processWebhookUseCase.execute({ payload, signature });
	}
}
