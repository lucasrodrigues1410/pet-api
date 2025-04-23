import { EnvService } from "@/core/infra/env/env.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { SendEmailUseCase } from "./application/use-cases/send-email.use-case";
import { NodemailerEmailService } from "./infra/mail/nodemailer-email.service";
import { TemplateProviders } from "./infra/providers/template.providers";

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [EnvService],
			useFactory: async (envService: EnvService) => ({
				transport: {
					host: envService.get("SMTP_HOST"),
					port: envService.get("SMTP_PORT"),
					secure: true,
					auth: {
						user: envService.get("SMTP_USER"),
						pass: envService.get("SMTP_PASS"),
					},
				},
			}),
		}),
	],
	providers: [
		...TemplateProviders,
		{
			provide: "IEmailService",
			useClass: NodemailerEmailService,
		},
		SendEmailUseCase,
	],
	exports: [SendEmailUseCase],
})
export class EmailModule {}
