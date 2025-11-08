import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { TranslateRulesService } from "../services/translation-rules.service";

type UseCaseInput = {
	serviceId: string;
	name?: string;
	description?: string;
	price?: number;
	duration?: number;
	rules?: string;
	isActive?: boolean;
	userId: string;
	companyId: string;
	categoryIds?: string[];
	requiresPayment?: boolean;
};

type UseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

@Injectable()
export class UpdateServiceUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepository: StaffRepository,
		private readonly translateRules: TranslateRulesService,
	) {}
	async execute(data: UseCaseInput): Promise<UseCaseOutput> {
		const [staff, service] = await Promise.all([
			this.staffRepository.findByUserId(data.userId, data.companyId),
			this.serviceRepository.findById(data.serviceId),
		]);

		if (!staff) {
			return left(new NotAllowedError("The user is not staff of this company"));
		}

		if (!service) {
			return left(new ResourceNotFoundError("Service not found"));
		}

		let rules: Rules[] | undefined;
		if (data.rules) {
			rules = await this.translateRules.execute({ rules: data.rules });
		}

		service.update({
			...data,
			rules: rules,
			rulesPrompt: data.rules,
			categoryIds: data.categoryIds?.map((id) => new UniqueEntityID(id)),
		});

		await this.serviceRepository.update(service.id.toString(), service);
		return right(undefined);
	}
}
