import { Service, ServiceWithRelations } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findById(id: string): Promise<ServiceWithRelations | undefined>;
	abstract findByCompanyId(companyId: string): Promise<Service[]>;
	abstract create(service: Service): Promise<void>;
	abstract update(service: Service): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
