import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { PrismaCompanyAvailabilityMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";
import { PrismaCompanyMapper } from "../mappers/prisma-company.mapper";

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		const result = await this.prismaService.company.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				companyImage: {
					include: {
						asset: true,
					},
				},
				logo: true,
				companyAvailability: true,
			},
		});

		if (!result) return null;

		return Object.assign(PrismaCompanyMapper.toDomain(result), {
			availabilities: result.companyAvailability.map(
				PrismaCompanyAvailabilityMapper.toDomain,
			),
			images: result.companyImage.map((i) =>
				PrismaAssetMapper.toDomain(i.asset),
			),
		});
	}
}
