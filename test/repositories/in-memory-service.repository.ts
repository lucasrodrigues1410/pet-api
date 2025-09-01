import {
	Service,
	ServiceWithRelations,
} from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";

export class InMemoryServiceRepository implements ServiceRepository {
	public items: Service[] = [];

	async create(service: Service, _?: string[]) {
		// Para testes em memória, apenas adicionamos o serviço
		// As categorias seriam tratadas em um repositório real
		this.items.push(service);
	}

	async findById(id: string) {
		const result = this.items.find((service) => service.id.toString() === id);
		if (!result) {
			return undefined;
		}
		return result as ServiceWithRelations;
	}

	async update(id: string, service: Partial<Service>) {
		const itemIndex = this.items.findIndex((item) => item.id.toString() === id);
		if (itemIndex >= 0) {
			this.items[itemIndex].update(service);
		}
	}

	async findByCompanyId(companyId: string) {
		const result = this.items.filter(
			(service) => service.companyId.toString() === companyId,
		);
		return result;
	}
}
