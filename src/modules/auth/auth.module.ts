import { Module } from "@nestjs/common";
import { StaffModule } from "../staff/staff.module";
import { UserModule } from "../user/user.module";
import { CreateOrUpdateUserFromExternalUseCase } from "./application/use-cases/create-or-update-user-from-external.use-case";
import { AuthProviderService } from "./domain/interfaces/auth-provider.service.interface";
import { ClerkWebhookController } from "./infra/http/controllers/clerk-webhook.controller";
import { ClerkAuthProviderService } from "./infra/services/clerk-auth-provider.service";

@Module({
	imports: [UserModule, StaffModule],
	controllers: [ClerkWebhookController],
	providers: [
		CreateOrUpdateUserFromExternalUseCase,
		{ provide: AuthProviderService, useClass: ClerkAuthProviderService },
	],
})
export class AuthModule {}
