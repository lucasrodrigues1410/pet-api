import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { Disease } from "../../domain/entities/disease.entity";
import { DiseaseRepository } from "../../domain/repositories/disease.repository";

type ListDiseasesUseCaseResponse = Either<
	null,
	{ items: Disease[] }
>;

@Injectable()
export class ListDiseasesUseCase {
	constructor(private readonly diseaseRepository: DiseaseRepository) {}

	async execute(query?: string): Promise<ListDiseasesUseCaseResponse> {
		const all = await this.diseaseRepository.getAll({ query });
		return right({ items: all });
	}
}
