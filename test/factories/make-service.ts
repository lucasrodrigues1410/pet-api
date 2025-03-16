import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Service, ServiceProps } from "src/modules/service/domain/entities/service.entity";
import { ServicePrismaMapper } from "src/modules/service/infra/database/prisma/mappers/service.mapper";

export function makeService(override: Partial<Service> = {}, id?: number) {
	const student = Service.create(
		{
			name: faker.commerce.productName(),
			description: faker.datatype.boolean({ probability: 0.8 })
				? faker.lorem.sentence()
				: null,
			price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
			isActive: faker.datatype.boolean(),
			duration: faker.datatype.boolean({ probability: 0.7 })
				? faker.number.int({ min: 1, max: 1440 })
				: null,
			companyId: faker.number.int({ min: 1, max: 1000 }),
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
			data: ServicePrismaMapper.toPrisma(service),
		});

		return service;
	}
}
