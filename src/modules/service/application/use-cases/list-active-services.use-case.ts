import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { Service } from "../../domain/entities/service.entity";
import { Either, right } from "src/common/either";

type ListActiveServicesUseCaseResponse = Either<
	null,
	{
		services: Service[];
	}
>;

@Injectable()
export class ListActiveServicesUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute(): Promise<ListActiveServicesUseCaseResponse> {
		const result = await this.serviceRepository.findAllActive();
        return right({
            services: result,
        })
	}
}
