import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { CompanyPrismaMapper } from "../mappers/company.mapper";

@Injectable()
export class CompanyPrismaRepository implements CompanyRepository {
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
			},
			take: 10,
			skip: (page - 1) * 10,
		});
		return result.map((company) => CompanyPrismaMapper.toDomain(company));
	}

	async findById(id: number): Promise<Company | null> {
		const result = await this.prismaService.company.findUnique({
			where: {
				id,
			},
		});
		if (!result) {
			return null;
		}
		return CompanyPrismaMapper.toDomain(result);
	}
}
