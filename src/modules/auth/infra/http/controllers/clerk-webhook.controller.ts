import { Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthProviderService } from "@/modules/auth/domain/interfaces/auth-provider.service.interface";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";

@Controller("auth/clerk")
export class ClerkWebhookController {
	constructor(private readonly authProviderService: AuthProviderService) {}

	@Post("webhook")
	@Public()
	@HttpCode(HttpStatus.OK)
	async handle(@Req() req): Promise<{ received: boolean }> {
		await this.authProviderService.processWebhook(req);
		return { received: true };
	}
}
