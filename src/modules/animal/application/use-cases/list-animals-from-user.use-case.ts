import { Injectable, Logger } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

type ListAnimalsFromUserUseCaseRequest = {
	userId: string;
} & PaginationQuery;

type ListAnimalsFromUserUseCaseResponse = Either<
	null,
	PaginationResult<Animal>
>;

@Injectable()
export class ListAnimalsFromUserUserUseCase {
	private readonly logger = new Logger(ListAnimalsFromUserUserUseCase.name);

	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: ListAnimalsFromUserUseCaseRequest,
	): Promise<ListAnimalsFromUserUseCaseResponse> {
		this.logger.log(`Executing list animals from user use case. UserId: ${data.userId}, Page: ${data.page}, Limit: ${data.limit}`);

		try {
			const result = await this.animalRepository.fetchAllAnimalsByUser(data);
			
			this.logger.log(`Successfully retrieved ${result.items.length} animals for user ${data.userId}`);
			this.logger.debug(`Pagination meta: ${JSON.stringify(result.meta)}`);
			
			return right(result);
		} catch (error) {
			this.logger.error(`Error listing animals for user ${data.userId}`, error instanceof Error ? error.stack : String(error));
			throw error;
		}
	}
}
