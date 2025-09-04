import { Injectable, Logger } from "@nestjs/common";
import { SendEmailEvent } from "../../domain/events/send-email.event";
import { EmailPublisher } from "../../domain/interfaces/email-publisher.interface";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

interface QueueEmailUseCaseInput<
	K extends keyof TemplateVariablesMap = keyof TemplateVariablesMap,
> {
	templateKey: K;
	target: string;
	variables: TemplateVariablesMap[K];
	priority?: "low" | "normal" | "high";
	delay?: number; // delay in milliseconds
}

@Injectable()
export class QueueEmailUseCase {
	private readonly logger = new Logger(QueueEmailUseCase.name);

	constructor(private readonly emailPublisher: EmailPublisher) {}

	async execute<K extends keyof TemplateVariablesMap>(
		params: QueueEmailUseCaseInput<K>,
	): Promise<void> {
		this.logger.log(
			`Queueing email - Template: ${params.templateKey}, Target: ${params.target}, Priority: ${params.priority || "normal"}`,
		);

		const event = SendEmailEvent.create(
			params.templateKey,
			params.target,
			params.variables,
			{
				priority: params.priority || "normal",
				delay: params.delay,
			},
		);

		await this.emailPublisher.dispatch(event);

		this.logger.log(
			`Email queued successfully - Template: ${params.templateKey}, Target: ${params.target}`,
		);
	}

	// Método auxiliar para emails de alta prioridade
	async executeHighPriority<K extends keyof TemplateVariablesMap>(
		params: Omit<QueueEmailUseCaseInput<K>, "priority">,
	): Promise<void> {
		return this.execute({ ...params, priority: "high" });
	}

	// Método auxiliar para emails com delay
	async executeWithDelay<K extends keyof TemplateVariablesMap>(
		params: QueueEmailUseCaseInput<K>,
		delayInMinutes: number,
	): Promise<void> {
		return this.execute({
			...params,
			delay: delayInMinutes * 60 * 1000,
		});
	}
}
