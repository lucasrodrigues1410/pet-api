import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Service,
	ServiceWithRelations,
} from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { PrismaCategoryMapper } from "@/modules/category/infra/http/database/mappers/prisma-category.mapper";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { calculateLocationBounds } from "@/shared/utils/geo-location.util";
import { PaginationResult } from "@/shared/utils/pagination";
import { paginate } from "@/shared/utils/paginator";
import { PrismaServiceMapper } from "../mappers/prisma-service.mapper";

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) { }

	async findById(id: string): Promise<ServiceWithRelations | undefined> {
		const result = await this.prismaService.service.findUnique({
			where: { id },
			include: {
				company: true,
				categories: {
					include: {
						category: true,
					},
				},
			},
		});

		if (!result) {
			return undefined;
		}

		return {
			...PrismaServiceMapper.toDomain(result),
			company: PrismaCompanyMapper.toDomain(result.company),
			categories: result.categories.map((category) =>
				PrismaCategoryMapper.toDomain(category.category),
			),
		} as ServiceWithRelations;
	}

	async findByCompanyId(companyId: string): Promise<Service[]> {
		const result = await this.prismaService.service.findMany({
			where: { companyId },
			include: {
				priceVariation: {
					select: {
						price: true,
					},
				},
			},
		});

		return result.map((service) => {
			return PrismaServiceMapper.toDomain({
				...service,
				maxPrice: service.priceVariation.reduce(
					(sum, v) => sum + v.price.toNumber(),
					0,
				),
			});
		});
	}

	async create(service: Service): Promise<void> {
		await this.prismaService.service.create({
			data: PrismaServiceMapper.toPrisma(service),
		});
	}

	async update(id: string, service: Partial<Service>): Promise<void> {
		await this.prismaService.service.update({
			where: { id },
			data: PrismaServiceMapper.toPrismaUpdate(service),
		});
	}

	async searchServices(
		params: Parameters<ServiceRepository["searchServices"]>[0],
	): Promise<PaginationResult<ServiceWithRelations>> {
		const {
			query,
			location,
			priceRange,
			...paginationParams
		} = params;

		const bounds = location
			? calculateLocationBounds({
				latitude: location.latitude,
				longitude: location.longitude,
				radiusInKm: location.radiusInKm,
			})
			: null;

		// Acumuladores de filtros
		const andConditions: Prisma.ServiceWhereInput[] = [{
			isActive: true,
			price: {
				gte: priceRange?.min,
				lte: priceRange?.max
			},
		}];
		const orConditions: Prisma.ServiceWhereInput[] = [
			{ name: { contains: query || "", mode: "insensitive" } },
			{ description: { contains: query || "", mode: "insensitive" } },
		];


		// Geolocalização (caixa) aplicada via company -> companyLocations
		if (bounds) {
			andConditions.push({
				company: {
					companyLocations: {
						some: {
							location: {
								latitude: { gte: bounds.minLat, lte: bounds.maxLat },
								longitude: { gte: bounds.minLon, lte: bounds.maxLon },
							},
						},
					},
				},
			});
		}

		// Monta where final de forma segura
		const whereConditions: Prisma.ServiceWhereInput = {
			AND: andConditions,
			...(orConditions.length ? { OR: orConditions } : {}),
		};

		const { items, ...rest } = await paginate(
			({ skip, take }) =>
				this.prismaService.service.findMany({
					where: whereConditions,
					include: {
						company: {
							include: {
								companyLocations: {
									include: {
										location: true,
									},
								},
							},
						},
						categories: {
							include: {
								category: true,
							},
						},
					},
					orderBy: { createdAt: "desc" },
					skip,
					take,
				}),
			() =>
				this.prismaService.service.count({
					where: whereConditions,
				}),
			paginationParams,
		);

		const servicesWithRelations = items.map((service) => {
			const serviceEntity = PrismaServiceMapper.toDomain(service);
			const companyEntity = PrismaCompanyMapper.toDomain(service.company);
			const categoriesEntities = service.categories.map(({ category }) => PrismaCategoryMapper.toDomain(category));
			return Object.assign(serviceEntity, {
				company: companyEntity,
				categories: categoriesEntities,
			});
		}) as ServiceWithRelations[];


		return {
			items: servicesWithRelations,
			...rest,
		};
	}
}
