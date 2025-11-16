import { Company } from "@/modules/company/domain/entities/company.entity";
import { Location } from "@/modules/location/domain/entities/location";
import { Service, ServiceWithRelations } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract create(service: Service): Promise<void>;
	abstract findById(id: string): Promise<ServiceWithRelations | undefined>;
	abstract findByCompanyId(companyId: string): Promise<Service[]>;
	abstract findByIdWithCompanyLocation(
		id: string,
	): Promise<(Service & { company: Company; location: Location }) | undefined>;
	abstract update(id: string, service: Partial<Service>): Promise<void>;
}
