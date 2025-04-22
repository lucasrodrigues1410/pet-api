import { Module } from "@nestjs/common";
import { SendEmailUseCase } from "./application/use-cases/send-email.use-case";
import { ReactEmailTemplateRenderer } from "./infra/templates/react-email-template-renderer";
import { NodemailerEmailService } from "./infra/mail/nodemailer-email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { EnvService } from "@/core/infra/env/env.service";

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
		{
			provide: "ITemplateRenderer",
			useClass: ReactEmailTemplateRenderer,
		},
		{
			provide: "IEmailService",
			useClass: NodemailerEmailService,
		},
		SendEmailUseCase,
	],
	exports: [SendEmailUseCase],
})
export class EmailModule {}
