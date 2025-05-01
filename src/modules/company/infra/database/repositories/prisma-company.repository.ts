import { calculateLocationBounds } from "@/shared/utils/geo-location.util";
import { paginate } from "@/shared/utils/paginator";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@/prisma-generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { PrismaCompanyMapper } from "../mappers/prisma-company.mapper";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async searchCompanies(
		params: Parameters<CompanyRepository["searchCompanies"]>[0],
	) {
		const query = params.query || "";
		const bounds = calculateLocationBounds({
			latitude: params.location?.latitude,
			longitude: params.location?.longitude,
		});

		const filterOptions = {
			OR: [
				{
					name: { contains: query, mode: "insensitive" },
				},
				{
					services: {
						some: {
							OR: [
								{ name: { contains: query, mode: "insensitive" } },
								{ description: { contains: query, mode: "insensitive" } },
							],
						},
					},
				},
			],
			companyLocations: {
				some: {
					location: {
						latitude: {
							gte: bounds?.minLat,
							lte: bounds?.maxLat,
						},
						longitude: {
							gte: bounds?.minLon,
							lte: bounds?.maxLon,
						},
					},
				},
			},
		} as Prisma.CompanyWhereInput;

		const { items, ...rest } = await paginate(
			({ skip, take }) =>
				this.prismaService.company.findMany({
					where: filterOptions,
					take,
					skip,
				}),
			() =>
				this.prismaService.company.count({
					where: filterOptions,
				}),
			params,
		);

		return {
			items: items.map((company) => PrismaCompanyMapper.toDomain(company)),
			...rest,
		};
	}

	async findById(id: string): Promise<Company | null> {
		const result = await this.prismaService.company.findUnique({
			where: {
				id,
			},
		});
		if (!result) {
			return null;
		}
		return PrismaCompanyMapper.toDomain(result);
	}

	async create(company: Company): Promise<void> {
		await this.prismaService.company.create({
			data: PrismaCompanyMapper.toPrisma(company),
		});
	}
}
