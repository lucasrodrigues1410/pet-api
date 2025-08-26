import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Service,
	ServiceProps,
} from "src/modules/service/domain/entities/service.entity";
import { PrismaServiceMapper } from "src/modules/service/infra/database/mappers/prisma-service.mapper";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceRange } from "@/modules/service/domain/entities/value-objects/price-range.value-object";

export function makeService(
	override: Partial<Service> = {},
	id?: UniqueEntityID,
) {
	const student = Service.create(
		{
			name: faker.commerce.productName(),
			description: faker.datatype.boolean({ probability: 0.8 })
				? faker.lorem.sentence()
				: null,
			priceRange: PriceRange.create({
				min: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
				max: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
			}),
			isActive: faker.datatype.boolean(),
			duration: 10,
			companyId: new UniqueEntityID(),
			details: {},
			...override,
		},
		id,
	);

	return student;
}

@Injectable()
export class ServiceFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaService(data: Partial<ServiceProps> = {}): Promise<Service> {
		const service = makeService(data);

		await this.prisma.service.create({
			data: PrismaServiceMapper.toPrisma(service),
		});

		return service;
	}
}
