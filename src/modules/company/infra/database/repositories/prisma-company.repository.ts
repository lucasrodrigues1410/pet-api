import { calculateLocationBounds } from "@/shared/utils/geo-location.util";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { PrismaCompanyMapper } from "../mappers/prisma-company.mapper";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async searchCompanies(params: {
		location?: {
			latitude: number;
			longitude: number;
		};
		query?: string;
		page?: number;
	}): Promise<Company[]> {
		const query = params.query || "";
		const page = params.page || 1;

		const bounds = calculateLocationBounds({
			latitude: params.location?.latitude,
			longitude: params.location?.longitude,
		});

		const result = await this.prismaService.company.findMany({
			where: {
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
			},
			take: 10,
			skip: (page - 1) * 10,
		});
		return result.map((company) => PrismaCompanyMapper.toDomain(company));
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
