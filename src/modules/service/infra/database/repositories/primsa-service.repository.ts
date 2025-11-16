import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { PrismaCategoryMapper } from "@/modules/category/infra/database/mappers/prisma-category.mapper";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { PrismaLocationMapper } from "@/modules/location/infra/database/mappers/prisma-location.mapper";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { PrismaServiceMapper } from "../mappers/prisma-service.mapper";

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async create(service: Service) {
		await this.prismaService.service.create({
			data: {
				...PrismaServiceMapper.toPrisma(service),
				categories: {
					create: service.categoryIds.map((categoryId) => ({
						categoryId: categoryId.toString(),
						assignedAt: new Date(),
					})),
				},
			},
		});
	}

	async findById(id: string) {
		const result = await this.prismaService.service.findUnique({
			where: { id },
			include: { company: true, categories: { include: { category: true } } },
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
		const prismaData = PrismaServiceMapper.toPrismaUpdate(service);
		await this.prismaService.service.update({
			where: { id },
			data: {
				...prismaData,
				categories: {
					deleteMany: {},
					create: service.categoryIds?.map((categoryId) => ({
						categoryId: categoryId.toString(),
						assignedAt: new Date(),
					})),
				},
			},
		});
	}

	async findByCompanyId(companyId: string) {
		const result = await this.prismaService.service.findMany({
			where: { companyId },
			orderBy: { createdAt: "desc" },
			include: { categories: { include: { category: true } } },
		});

		return result.map((service) => PrismaServiceMapper.toDomain(service));
	}

	async findByIdWithCompanyLocation(id: string) {
		const result = await this.prismaService.service.findUnique({
			where: { id },
			include: {
				categories: { include: { category: true } },
				company: { include: { location: true } },
			},
		});

		if (!result) {
			return undefined;
		}

		const service = PrismaServiceMapper.toDomain(result);
		return Object.assign(service, {
			company: PrismaCompanyMapper.toDomain(result.company),
			location: PrismaLocationMapper.toDomain(result.company.location),
		});
	}
}
