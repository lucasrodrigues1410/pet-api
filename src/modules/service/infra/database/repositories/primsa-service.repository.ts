import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Service,
	ServiceWithRelations,
} from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { PrismaCategoryMapper } from "@/modules/category/infra/http/database/mappers/prisma-category.mapper";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { getServicesWithMaxPrice } from "@/prisma-generated/sql";
import { PrismaServiceMapper } from "../mappers/prisma-service.mapper";

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

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
		const result = await this.prismaService.$queryRawTyped(
			getServicesWithMaxPrice(companyId),
		);

		return result.map((service) => {
			return PrismaServiceMapper.toDomain({
				...service,
				maxPrice: service.totalPriceVariation,
			});
		});
	}

	async create(service: Service): Promise<void> {
		await this.prismaService.service.create({
			data: PrismaServiceMapper.toPrisma(service),
		});
	}
}
