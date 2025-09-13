import { Category } from "@/modules/category/domain/entities/category.entity";
import { CategoryPresenter } from "@/modules/category/infra/http/presenters/category.presenter";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { ServicePresenter } from "./service.presenter";

export class ServiceDetailsPresenter {
	static present(
		service: Service & { company: Company; categories: Category[] },
	) {
		return {
			...ServicePresenter.present(service),
			company: CompanyPresenter.presentBasic(service.company),
			categories: service.categories.map((category) =>
				CategoryPresenter.present(category),
			),
		};
	}
}
