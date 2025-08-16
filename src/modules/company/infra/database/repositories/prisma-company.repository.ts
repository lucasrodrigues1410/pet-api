import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { calculateLocationBounds } from "@/shared/utils/geo-location.util";
import { paginate } from "@/shared/utils/paginator";
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
			deletedAt: null,
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
		const result = await this.prismaService.company.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
		if (!result) {
			return null;
		}
		return PrismaCompanyMapper.toDomain(result);
	}

	async update(
		companyId: string,
		data: Parameters<CompanyRepository["update"]>[1],
	): Promise<Company> {
		await this.prismaService.company.updateMany({
			where: { id: companyId, deletedAt: null },
			data: {
				name: data.name,
				address: data.address,
				contact: data.contact,
			},
		});
		const refreshed = await this.prismaService.company.findFirst({
			where: { id: companyId, deletedAt: null },
		});
		if (!refreshed) {
			throw new Error("Company not found");
		}
		return PrismaCompanyMapper.toDomain(refreshed);
	}

	async softDelete(companyId: string): Promise<void> {
		await this.prismaService.company.update({
			where: { id: companyId },
			data: { deletedAt: new Date() },
		});
	}

	async isOwner(params: {
		companyId: string;
		userId: string;
	}): Promise<boolean> {
		const uc = await this.prismaService.userCompany.findFirst({
			where: {
				companyId: params.companyId,
				userId: params.userId,
				role: "ADMIN",
			},
			select: { id: true },
		});
		return !!uc;
	}
}
