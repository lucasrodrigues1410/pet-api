import { Service } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findById(id: number): Promise<Service | undefined>;
	abstract findByCompanyId(companyId: number): Promise<Service[]>;
	abstract create(service: Service): Promise<void>;
}
