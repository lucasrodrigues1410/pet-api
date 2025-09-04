import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { PrismaCategoryMapper } from "@/modules/category/infra/database/mappers/prisma-category.mapper";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { PrismaServiceMapper } from "../mappers/prisma-service.mapper";

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async create(service: Service, categoryIds?: string[]) {
		await this.prismaService.service.create({
			data: {
				...PrismaServiceMapper.toPrisma(service),
				...(categoryIds &&
					categoryIds.length > 0 && {
						categories: {
							create: categoryIds.map((categoryId) => ({
								categoryId,
								assignedAt: new Date(),
							})),
						},
					}),
			},
		});
	}

	async findById(id: string) {
		const result = await this.prismaService.service.findUnique({
			where: { 
				id,
				isActive: true 
			},
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

		var service = Object.assign(PrismaServiceMapper.toDomain(result), {
			company: PrismaCompanyMapper.toDomain(result.company),
			categories: result.categories.map((category) =>
				PrismaCategoryMapper.toDomain(category.category),
			),
		});

		return service;
	}

	async update(id: string, service: Partial<Service>) {
		await this.prismaService.service.update({
			where: { id },
			data: PrismaServiceMapper.toPrismaUpdate(service),
		});
	}

	async findByCompanyId(companyId: string) {
		const result = await this.prismaService.service.findMany({
			where: { 
				companyId,
			},
		});

		return result.map((service) => PrismaServiceMapper.toDomain(service));
	}
}
