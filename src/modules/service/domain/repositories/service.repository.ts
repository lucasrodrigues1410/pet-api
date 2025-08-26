import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Service, ServiceWithRelations } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract findById(id: string): Promise<ServiceWithRelations | undefined>;
	abstract findByCompanyId(companyId: string): Promise<Service[]>;
	abstract update(id: string, service: Partial<Service>): Promise<void>;
	abstract searchServices(
		params: {
			query?: string;
			location?: {
				latitude: number;
				longitude: number;
				radiusInKm?: number;
			};
			priceRange?: {
				min?: number;
				max?: number;
			};
		} & PaginationQuery,
	): Promise<PaginationResult<ServiceWithRelations>>;
}
