import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { SyncExternalUserUseCase } from "./application/use-cases/sync-external-user.use-case";
import { AuthProviderService } from "./domain/interfaces/auth-provider.service.interface";
import { ClerkWebhookController } from "./infra/http/controllers/clerk-webhook.controller";
import { ClerkAuthProviderService } from "./infra/services/clerk-auth-provider.service";

@Module({
	imports: [UserModule],
	controllers: [ClerkWebhookController],
	providers: [
		SyncExternalUserUseCase,
		{ provide: AuthProviderService, useClass: ClerkAuthProviderService },
	],
	exports: [AuthProviderService],
})
export class AuthModule {}
