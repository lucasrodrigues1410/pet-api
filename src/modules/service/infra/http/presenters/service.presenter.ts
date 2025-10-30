import { Service } from "@/modules/service/domain/entities/service.entity";
import { RulesPresenter } from "./rules.presenter";

export class ServicePresenter {
	static present(service: Service) {
		return {
			id: service.id.toString(),
			name: service.name,
			description: service.description,
			price: service.price,
			isActive: service.isActive,
			duration: service.duration,
			companyId: service.companyId.toString(),
			details: service.details,
			rules: service.rules?.map((rule) => RulesPresenter.present(rule)),
			rulesPrompt: service.rulesPrompt,
		};
	}
}
