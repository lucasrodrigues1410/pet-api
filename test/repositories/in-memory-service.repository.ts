import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";

export class InMemoryServiceRepository implements ServiceRepository {
	private services: Service[] = [];

	findById(id: string): Promise<Service | undefined> {
		return Promise.resolve(
			this.services.find((service) => service.id.toString() === id),
		);
	}
	findByCompanyId(companyId: string): Promise<Service[]> {
		return Promise.resolve(
			this.services.filter(
				(service) => service.companyId.toString() === companyId,
			),
		);
	}

	async create(service: Service): Promise<void> {
		this.services.push(service);
		await Promise.resolve(service);
	}
}
