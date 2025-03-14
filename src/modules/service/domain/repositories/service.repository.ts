import { Service } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findById(id: number): Promise<Service | undefined>;
	abstract findAllActive(): Promise<Service[]>;
}
