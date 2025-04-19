import { CategoryPresenter } from "@/modules/category/infra/http/presenters/category.presenter";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";
import { ServiceWithRelations } from "@/modules/service/domain/entities/service.entity";
import { z } from "zod";
import { serviceDetailsDto } from "../dtos/service-details.dto";
import { ServicePresenter } from "./service.presenter";

export class ServiceDetailsPresenter {
	static toHTTP(
		service: ServiceWithRelations,
	): z.infer<typeof serviceDetailsDto> {
		return {
			...ServicePresenter.toHTTP(service),
			company: CompanyPresenter.toHTTP(service.company),
			categories: service.categories.map(CategoryPresenter.toHTTP),
		};
	}
}
