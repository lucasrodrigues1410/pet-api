import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { PrismaAssetMapper as AssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { PrismaCompanyAvailabilityMapper as AvlbyMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";
import { PrismaLocationMapper } from "@/modules/location/infra/database/mappers/prisma-location.mapper";
import { PrismaServiceMapper } from "@/modules/service/infra/database/mappers/prisma-service.mapper";
import { paginate } from "@/shared/utils/paginator";
import { PrismaCompanyMapper } from "../mappers/prisma-company.mapper";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async findByUserId(userId: string) {
		const result = await this.prismaService.company.findFirst({
			where: { companyUsers: { some: { userId } } },
		});
		if (!result) return null;
		return PrismaCompanyMapper.toDomain(result);
	}

	async findById(id: string) {
		const result = await this.prismaService.company.findUnique({
			where: { id, deletedAt: null },
			include: {
				companyImage: { include: { asset: true }, take: 1 },
				logo: true,
				companyAvailability: true,
				services: {
					where: { isActive: true },
					include: { categories: { include: { category: true } } },
				},
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
		const { search, location, categories, ...paginationParams } = params;

		// Acumuladores de filtros
		const andConditions: Prisma.CompanyWhereInput[] = [{ deletedAt: null }];
		const orConditions: Prisma.CompanyWhereInput[] = [];

		// Normalizar keywords uma única vez
		const keywords = search?.trim().split(/\s+/).filter(Boolean) ?? [];
		const categoryKeywords = (categories ?? []).filter(Boolean);
		const allKeywords = [...keywords, ...categoryKeywords];
		const searchString = allKeywords.join(" | ");

		if (allKeywords.length > 0) {
			orConditions.push(
				{
					services: {
						some: {
							name: { search: searchString, mode: "insensitive" },
							isActive: true,
						},
					},
				},
				{ name: { search: searchString, mode: "insensitive" } },
				{ description: { search: searchString, mode: "insensitive" } },
			);
		}

		// Geolocalização: usar AND dentro de location (não OR redundante)
		if (location) {
			const locationTrim = location.trim();
			andConditions.push({
				location: {
					AND: [
						{
							OR: [
								{ city: { contains: locationTrim, mode: "insensitive" } },
								{ state: { contains: locationTrim, mode: "insensitive" } },
								{ country: { contains: locationTrim, mode: "insensitive" } },
								{
									neighborhood: { contains: locationTrim, mode: "insensitive" },
								},
							],
						},
					],
				},
			});
		}

		// Where final
		const whereConditions: Prisma.CompanyWhereInput = {
			AND: andConditions,
			...(orConditions.length ? { OR: orConditions } : {}),
		};

		const { items, meta } = await paginate(
			({ skip, take }) =>
				this.prismaService.company.findMany({
					where: whereConditions,
					include: {
						companyImage: { include: { asset: true } },
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

		return { items: companiesWithServices, meta };
	}

	async update(id: string, data: Partial<Company>): Promise<void> {
		await this.prismaService.company.update({
			where: { id },
			data: { logoAssetId: data.logoAssetId?.toString() },
		});
	}
}
