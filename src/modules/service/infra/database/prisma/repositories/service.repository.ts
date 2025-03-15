import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { ServicePrismaMapper } from "../mappers/service.mapper";

@Injectable()
export class ServicePrismaRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: number): Promise<Service | undefined> {
		const result = await this.prismaService.service.findUnique({
			where: { id },
			include: {
				company: true,
				categories: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
								type: true,
								createdAt: true,
								updatedAt: true,
							},
						},
					},
				},
			},
		});

		if (!result) {
			return undefined;
		}

		return ServicePrismaMapper.toDomain({
			...result,
			company: result.company,
			categories: result.categories.map((category) => ({
				...category.category,
				description: null,
				parentId: null,
			})),
		});
	}

	async findByCompanyId(companyId: number): Promise<Service[]> {
		const result = await this.prismaService.service.findMany({
			where: {
				isActive: true,
				companyId,
			},
			include: {
				company: true,
				categories: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
								type: true,
								createdAt: true,
								updatedAt: true,
							},
						},
					},
				},
			},
			take: 10,
		});

		return result.map(({ categories,company, ...service }) =>
			ServicePrismaMapper.toDomain({
				...service,
				company,
				categories: categories.map((category) => ({
					...category.category,
					description: null,
					parentId: null,
				})),
			}),
		);
	}

	async findAll(): Promise<Service[]> {
		const result = await this.prismaService.service.findMany({
			include: {
				company: true,
				categories: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
								type: true,
								createdAt: true,
								updatedAt: true,
							},
						},
					},
				},
			},
		});

		return result.map(({ categories, company, ...service }) =>
			ServicePrismaMapper.toDomain({
				...service,
				company,
				categories: categories.map((category) => ({
					...category.category,
					description: null,
					parentId: null,
				})),
			}),
		);
	}
}
