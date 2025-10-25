import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Service } from "../../domain/entities/service.entity";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { TranslateRulesUseCase } from "./translate-rules.use-case";

type CreateServiceUseCaseRequest = {
	name: string;
	description: string;
	price: number;
	duration: number;
	rules?: string;
	userId: string;
	categoryIds?: string[];
};

type CreateServiceUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class CreateServiceUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepository: StaffRepository,
		private readonly translateRulesUseCase: TranslateRulesUseCase,
	) {}
	async execute(
		data: CreateServiceUseCaseRequest,
	): Promise<CreateServiceUseCaseResponse> {
		const staff = await this.staffRepository.findByUserId(data.userId);
		if (!staff) {
			return left(new ResourceNotFoundError("Funcionário não encontrado"));
		}

		let rules: Rules[] | undefined;
		if (data.rules) {
			rules = await this.translateRulesUseCase.execute({ rules: data.rules });
		}

		const service = Service.create({
			name: data.name,
			description: data.description,
			price: data.price,
			duration: data.duration,
			rules: rules,
			isActive: true,
			rulesPrompt: data.rules,
			companyId: staff.companyId,
		});

		await this.serviceRepository.create(service, data.categoryIds);
		return right(undefined);
	}
}
