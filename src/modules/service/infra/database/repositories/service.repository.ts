import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { ServiceRepository } from "src/modules/service/domain/repositories/service.repository";
import { PrismaServiceMapper } from "../mappers/prisma-service.mapper";

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string): Promise<Service | undefined> {
		const result = await this.prismaService.service.findUnique({
			where: { id },
			include: {
				company: true,
				priceVariation: true,
				categories: {
					include: {
						category: true
					},
				},
			},
		});

		if (!result) {
			return undefined;
		}

		return PrismaServiceMapper.toDomain({
			...result,
			company: result.company,
			priceVariations: result.priceVariation,
			categories: result.categories.map((category) => ({
				...category.category,
				description: null,
				parentId: null,
			})),
		});
	}

	async findByCompanyId(companyId: string): Promise<Service[]> {
		const result = await this.prismaService.service.findMany({
			where: {
				isActive: true,
				companyId,
			},
			include: {
				priceVariation: true,
			},
		});

		return result.map(({ ...service }) =>
			PrismaServiceMapper.toDomain({
				...service,
				priceVariations: service.priceVariation,
			}),
		);
	}

	async create(service: Service): Promise<void> {
		await this.prismaService.service.create({
			data: PrismaServiceMapper.toPrisma(service),
		});
	}
}
