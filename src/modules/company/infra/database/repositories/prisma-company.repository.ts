import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { PrismaAssetMapper as AssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { PrismaCompanyAvailabilityMapper as AvlbyMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";
import { PrismaLocationMapper } from "@/modules/location/infra/database/mappers/prisma-location.mapper";
import { PrismaServiceMapper } from "@/modules/service/infra/database/mappers/prisma-service.mapper";
import { calculateLocationBounds } from "@/shared/utils/geo-location.util";
import { normalizeText } from "@/shared/utils/normalize-text";
import { paginate } from "@/shared/utils/paginator";
import { PrismaCompanyMapper } from "../mappers/prisma-company.mapper";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		const result = await this.prismaService.company.findUnique({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				companyImage: {
					include: {
						asset: true,
					},
					take: 1,
				},
				logo: true,
				companyAvailability: true,
				services: true,
				location: true,
			},
		});

		if (!result) return null;

		return Object.assign(PrismaCompanyMapper.toDomain(result), {
			availabilities: result.companyAvailability.map(AvlbyMapper.toDomain),
			images: result.companyImage.map((i) => AssetMapper.toDomain(i.asset)),
			services: result.services.map(PrismaServiceMapper.toDomain),
			address: PrismaLocationMapper.toDomain(result.location),
		});
	}

	async searchCompanies(
		params: Parameters<CompanyRepository["searchCompanies"]>[0],
	) {
		const { query, location, ...paginationParams } = params;

		const bounds = location
			? calculateLocationBounds({
					latitude: location.latitude,
					longitude: location.longitude,
					radiusInKm: location.radiusInKm,
				})
			: null;

		// Acumuladores de filtros
		const andConditions: Prisma.CompanyWhereInput[] = [
			{
				deletedAt: null,
			},
		];

		const orConditions: Prisma.CompanyWhereInput[] = [];

		if (query) {
			const normalizedQuery = normalizeText(query);
			const keywords = normalizedQuery
				.split(" ")
				.filter(
					(word) =>
						word.length > 2 &&
						!["e", "de", "da", "do", "em", "para", "com"].includes(word),
				);

			if (keywords.length > 0) {
				const serviceConditions = keywords.map((keyword) => ({
					services: {
						some: {
							name: {
								contains: keyword,
								mode: "insensitive",
							},
							isActive: true,
						},
					},
				})) as Prisma.CompanyWhereInput[];

				const nameConditions = keywords.map((keyword) => ({
					name: {
						contains: keyword,
						mode: "insensitive",
					},
				})) as Prisma.CompanyWhereInput[];

				const descriptionConditions = keywords.map((keyword) => ({
					description: {
						contains: keyword,
						mode: "insensitive",
					},
				})) as Prisma.CompanyWhereInput[];

				orConditions.push(
					...serviceConditions,
					...nameConditions,
					...descriptionConditions,
				);
			}
		}

		// Geolocalização (caixa) aplicada via companyLocations
		if (bounds) {
			andConditions.push({
				location: {
					latitude: { gte: bounds.minLat, lte: bounds.maxLat },
					longitude: { gte: bounds.minLon, lte: bounds.maxLon },
				},
			});
		}

		// Monta where final de forma segura
		const whereConditions: Prisma.CompanyWhereInput = {
			AND: andConditions,
			...(orConditions.length ? { OR: orConditions } : {}),
		};

		const { items, meta } = await paginate(
			({ skip, take }) =>
				this.prismaService.company.findMany({
					where: whereConditions,
					include: {
						companyImage: {
							include: {
								asset: true,
							},
						},
						location: true,
					},
					orderBy: { createdAt: "desc" },
					skip,
					take,
				}),
			async () => this.prismaService.company.count({ where: whereConditions }),
			paginationParams,
		);

		const companiesWithServices = items.map((company) => {
			const companyEntity = PrismaCompanyMapper.toDomain(company);
			const location = company.location;

			return Object.assign(companyEntity, {
				address: PrismaLocationMapper.toDomain(location),
				image: AssetMapper.toDomain(company.companyImage[0].asset),
			});
		});

		return {
			items: companiesWithServices,
			meta,
		};
	}

	async update(id: string, data: Partial<Company>): Promise<void> {
		await this.prismaService.company.update({
			where: { id },
			data: {
				logoAssetId: data.logoAssetId?.toString(),
			},
		});
	}
}
