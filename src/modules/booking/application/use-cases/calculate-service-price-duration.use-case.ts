import { Injectable } from "@nestjs/common";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CoatType } from "../../../appointment/domain/entities/appointment.entity";
import { NotPossibleCompleteAppointmentError } from "../errors/not-possible-comple-appointment";
import { RulesExecutionService } from "../services/rules-execution.service";

interface CalculateServicePriceDurationUseCaseRequest {
	serviceId: string;
	animalId: string;
	coatType: CoatType;
	disease?: string;
}

type CalculateServicePriceDurationUseCaseResponse = Either<
	ResourceNotFoundError | NotPossibleCompleteAppointmentError,
	{ price: number; duration: number }
>;

@Injectable()
export class CalculateServicePriceDurationUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly animalRepository: AnimalRepository,
		private readonly rulesExecution: RulesExecutionService,
	) {}

	async execute({
		serviceId,
		animalId,
		coatType,
		disease,
	}: CalculateServicePriceDurationUseCaseRequest): Promise<CalculateServicePriceDurationUseCaseResponse> {
		const [service, animal] = await Promise.all([
			this.serviceRepository.findByIdWithCompanyLocation(serviceId),
			this.animalRepository.findById(animalId),
		]);

		if (!service || !animal || !service.isActive) {
			return left(new ResourceNotFoundError());
		}

		const ruleExecutionResult = await this.rulesExecution.execute(
			animal,
			service.rules,
			disease,
			coatType,
		);

		if ("action" in ruleExecutionResult) {
			return left(
				new NotPossibleCompleteAppointmentError(
					"Serviço indisponível para o animal com as características informadas.",
				),
			);
		}

		const price = service.price + (ruleExecutionResult?.price ?? 0);
		const duration =
			service.duration + (ruleExecutionResult?.durationMinutes ?? 0);

		return right({
			price,
			duration,
		});
	}
}
