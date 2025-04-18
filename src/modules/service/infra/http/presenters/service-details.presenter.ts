import { CategoryPresenter } from "@/modules/category/infra/http/presenters/category.presenter";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";
import { ServiceWithRelations } from "@/modules/service/domain/entities/service.entity";
import { z } from "zod";
import { ServicePresenter } from "./service.presenter";
import { serviceDetatilsDto } from "../dtos/service-details.dto";

export class ServiceDetailsPresenter {
	static toHTTP(
		service: ServiceWithRelations,
	): z.infer<typeof serviceDetatilsDto> {
		return {
			...ServicePresenter.toHTTP(service),
			company: CompanyPresenter.toHTTP(service.company),
			categories: service.categories.map(CategoryPresenter.toHTTP),
		};
	}
}
