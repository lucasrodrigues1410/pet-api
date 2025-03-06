import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { ServicePrismaMapper } from "../mappers/service.mapper";

const dictionaryDayOfWeek = [
	"SUNDAY",
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
] as const;

@Injectable()
export class ServicePrismaRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async findAllActive(): Promise<Service[]> {
		const now = new Date();
		const formattedTime = now.toISOString().split("T")[1].slice(0, 8);

		const result = await this.prismaService.service.findMany({
			where: {
				isActive: true,
				AND: {
					company: {
						companyAvailability: {
							some: {
								day: {
									equals: dictionaryDayOfWeek[new Date().getDay()],
								},
								startTime: {
									gte: formattedTime,
								},
								endTime: {
									lte: formattedTime,
								},
							},
						},
						companyAvailabilityException: {
							none: {
								startDate: {
									lte: now.toISOString().split("T")[0],
								},
								endDate: {
									gte: now.toISOString().split("T")[0],
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
