import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
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
	companyId: string;
	categoryIds?: string[];
	requiresPayment: boolean;
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
		const staff = await this.staffRepository.findByUserId(
			data.userId,
			data.companyId,
		);
		if (!staff) {
			return left(new NotAllowedError("The user is not staff of this company"));
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
			rulesPrompt: data.rules,
			companyId: staff.companyId,
			requiresPayment: data.requiresPayment,
		});

		await this.serviceRepository.create(service, data.categoryIds);
		return right(undefined);
	}
}
