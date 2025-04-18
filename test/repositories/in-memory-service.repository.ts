import {
	Service,
	ServiceWithRelations,
} from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";

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
}
