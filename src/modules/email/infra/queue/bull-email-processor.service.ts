import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { SendEmailUseCase } from "../../application/use-cases/send-email.use-case";
import { SendEmailEvent } from "../../domain/events/send-email.event";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

@Processor("emails")
@Injectable()
export class BullEmailProcessor extends WorkerHost {
	private readonly logger = new Logger(BullEmailProcessor.name);

	constructor(private readonly sendEmailUseCase: SendEmailUseCase) {
		super();
	}

	async process(job: Job<SendEmailEvent<keyof TemplateVariablesMap>>) {
		const { templateKey, target, variables } = job.data;

		this.logger.log(
			`Processing email job ${job.id} - Template: ${templateKey}, Target: ${target}`
		);

		try {
			await this.sendEmailUseCase.execute({
				templateKey,
				target,
				variables,
			});

			this.logger.log(
				`Email sent successfully - Job: ${job.id}, Template: ${templateKey}, Target: ${target}`
			);
		} catch (error) {
			this.logger.error(
				`Failed to send email - Job: ${job.id}, Template: ${templateKey}, Target: ${target}`,
				(error as Error).stack
			);
			
			// Re-throw para que o Bull possa fazer retry
			throw error;
		}
	}
}
