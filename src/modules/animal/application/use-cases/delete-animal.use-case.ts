import { Injectable, Logger } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface DeleteAnimalUseCaseRequest {
	animalId: string;
	userId: string;
}

type DeleteAnimalUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteAnimalUseCase {
	private readonly logger = new Logger(DeleteAnimalUseCase.name);

	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: DeleteAnimalUseCaseRequest,
	): Promise<DeleteAnimalUseCaseResponse> {
		this.logger.log(`Executing delete animal use case. AnimalId: ${data.animalId}, UserId: ${data.userId}`);

		try {
			const animal = await this.animalRepository.findById(data.animalId);

			if (!animal) {
				this.logger.warn(`Animal not found for deletion. AnimalId: ${data.animalId}`);
				return left(new ResourceNotFoundError());
			}

			if (animal.userId.toString() !== data.userId) {
				this.logger.warn(`User ${data.userId} attempted to delete animal ${data.animalId} owned by user ${animal.userId.toString()}`);
				return left(new ResourceNotFoundError());
			}

			this.logger.debug(`Animal found and ownership verified. Proceeding with deletion`);

			await this.animalRepository.delete(data.animalId);
			
			this.logger.log(`Animal ${data.animalId} deleted successfully for user ${data.userId}`);
			
			return right(undefined);
		} catch (error) {
			this.logger.error(`Error deleting animal ${data.animalId} for user ${data.userId}`, error instanceof Error ? error.stack : String(error));
			throw error;
		}
	}
}
