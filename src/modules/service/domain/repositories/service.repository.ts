import { Service } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findAllActive(): Promise<Service[]>;
}
