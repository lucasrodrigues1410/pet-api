import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EnvService } from "@/core/infra/env/env.service";
import { QueueEmailUseCase } from "./application/use-cases/queue-email.use-case";
import { SendEmailUseCase } from "./application/use-cases/send-email.use-case";
import { EmailPublisher } from "./domain/interfaces/email-publisher.interface";
import { NodemailerEmailService } from "./infra/mail/nodemailer-email.service";
import { TemplateProviders } from "./infra/providers/template.providers";
import { BullEmailDispatcher } from "./infra/queue/bull-email-dispatcher.service";
import { BullEmailProcessor } from "./infra/queue/bull-email-processor.service";

@Module({
	imports: [
		BullModule.registerQueue({ name: "emails" }),
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
		{ provide: "IEmailService", useClass: NodemailerEmailService },
		{ provide: EmailPublisher, useClass: BullEmailDispatcher },
		SendEmailUseCase,
		QueueEmailUseCase,
		BullEmailProcessor,
	],
	exports: [SendEmailUseCase, QueueEmailUseCase],
})
export class EmailModule {}
