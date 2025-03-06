import { Injectable } from "@nestjs/common";
import { getDayOfWeek } from "src/common/enums/day-of-week.enum";
import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { ServicePrismaMapper } from "../mappers/service.mapper";

@Injectable()
export class ServicePrismaRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async findAllActive(): Promise<Service[]> {
		const now = new Date();

		const result = await this.prismaService.service.findMany({
			where: {
				isActive: true,
				AND: {
					company: {
						companyAvailability: {
							some: {
								day: {
									equals: getDayOfWeek(now),
								},
								startTime: {
									lte: now,
								},
								endTime: {
									gte: now,
								},
							},
						},
						companyAvailabilityException: {
							none: {
								startDate: {
									lte: now,
								},
								endDate: {
									gte: now,
								},
							},
						},
					},
				},
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
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

		return result.map(({ categories, ...service }) =>
			ServicePrismaMapper.toDomain({
				...service,
				categories: categories.map((category) => ({
					...category.category,
					description: null,
					parentId: null,
				})),
			}),
		);
	}
}
