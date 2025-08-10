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

	async update(service: Service) {
		const itemIndex = this.items.findIndex((item) => item.id.equals(service.id));
		if (itemIndex >= 0) {
			this.items[itemIndex] = service;
		}
	}

	async delete(id: string) {
		const itemIndex = this.items.findIndex((item) => item.id.toString() === id);
		if (itemIndex >= 0) {
			this.items[itemIndex].props.isActive = false;
		}
	}
}
