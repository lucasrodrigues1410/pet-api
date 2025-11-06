import { Injectable } from "@nestjs/common";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { TranslateRulesUseCase } from "./translate-rules.use-case";

type UseCaseInput = {
	serviceId: string;
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

type UseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, void>;

@Injectable()
export class UpdateServiceUseCase {
	constructor(
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepository: StaffRepository,
		private readonly translateRulesUseCase: TranslateRulesUseCase,
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
			rules = await this.translateRulesUseCase.execute({ rules: data.rules });
		}

		service.update({
			name: data.name,
			description: data.description,
			price: data.price,
			duration: data.duration,
			rules: rules,
			rulesPrompt: data.rules,
			requiresPayment: data.requiresPayment,
		});

		await this.serviceRepository.update(service.id.toString(), service);
		return right(undefined);
	}
}
