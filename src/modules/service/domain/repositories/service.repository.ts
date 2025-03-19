import { Service } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findById(id: string): Promise<Service | undefined>;
	abstract findByCompanyId(companyId: string): Promise<Service[]>;
	abstract create(service: Service): Promise<void>;
}
