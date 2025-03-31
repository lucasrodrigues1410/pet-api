import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";

export class InMemoryServiceRepository implements ServiceRepository {
	public items: Service[] = [];

	findById(id: string): Promise<Service | undefined> {
		return Promise.resolve(
			this.items.find((service) => service.id.toString() === id),
		);
	}
	findByCompanyId(companyId: string): Promise<Service[]> {
		return Promise.resolve(
			this.items.filter(
				(service) => service.companyId.toString() === companyId,
			),
		);
	}

	async create(service: Service): Promise<void> {
		this.items.push(service);
		await Promise.resolve(service);
	}
}
