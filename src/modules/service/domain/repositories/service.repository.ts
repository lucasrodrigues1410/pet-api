import { Service, ServiceWithRelations } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract create(service: Service, categoryIds?: string[]): Promise<void>;
	abstract findById(id: string): Promise<ServiceWithRelations | undefined>;
	abstract findByCompanyId(companyId: string): Promise<Service[]>;
	abstract update(id: string, service: Partial<Service>): Promise<void>;
}
