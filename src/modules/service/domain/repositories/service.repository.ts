import { Category } from "@/modules/category/domain/entities/category.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Service, ServiceWithRelations } from "../entities/service.entity";

export abstract class ServiceRepository {
	abstract create(service: Service, categoryIds?: string[]): Promise<void>;
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
	abstract findMostPopular(limit?: number): Promise<
		(Service & {
			company: Pick<Company, "id" | "name" | "contact">;
			categories:Pick<Category, "id" | "name">[];
		})[]
	>;
}
