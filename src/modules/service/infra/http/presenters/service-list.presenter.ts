import { Service } from "@/modules/service/domain/entities/service.entity";
import { ServicePresenter } from "./service.presenter";

export class ServiceListPresenter {
	static present(services: Service[]) {
		return {
			items: services.map((service) => ServicePresenter.present(service)),
		};
	}
}
