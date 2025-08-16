import {
	Service,
	ServiceWithRelations,
} from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryServiceRepository implements ServiceRepository {
	public items: Service[] = [];

	async findById(id: string) {
		const result = this.items.find((service) => service.id.toString() === id);
		if (!result) {
			return undefined;
		}
		return result as ServiceWithRelations;
	}

	async findByCompanyId(companyId: string) {
		const result = this.items.filter(
			(service) => service.companyId.toString() === companyId,
		);
		return result;
	}

	async create(service: Service) {
		this.items.push(service);
	}

	async update(id: string, service: Partial<Service>) {
		const itemIndex = this.items.findIndex((item) => item.id.toString() === id);
		if (itemIndex >= 0) {
			this.items[itemIndex].update(service);
		}
	}

	async searchServices(
		params: Parameters<ServiceRepository["searchServices"]>[0],
	) {
		const { query } =
			params;

		var items = this.items.filter((service) =>
			service.name.includes(query || ""),
		) as ServiceWithRelations[];

		return paginate(
			async () => items.slice(0, 10),
			async () => items.length,
			params,
		);
	}
}
