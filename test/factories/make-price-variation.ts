import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	PriceVariation,
	PriceVariationProps,
} from "@/modules/price-variation/domain/entities/price-variation.entity";
import { PrismaPriceVariationMapper } from "@/modules/price-variation/infra/database/mappers/prisma-price-variation.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";

const variation = ["SIZE"];
const value = ["SMALL", "MEDIUM", "LARGE"];

export function makePriceVariation(
	override: Partial<PriceVariation> = {},
	id?: UniqueEntityID,
) {
	const student = PriceVariation.create(
		{
			serviceId: new UniqueEntityID().toString(),
			price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
			variation: faker.helpers.arrayElement(variation),
			value: faker.helpers.arrayElement(value),
			...override,
		},
		id,
	);

	return student;
}

@Injectable()
export class PriceVariationFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaPriceVariation(
		data: Partial<PriceVariationProps> = {},
	): Promise<PriceVariation> {
		const priceVariation = makePriceVariation(data);

		await this.prisma.servicePriceVariation.create({
			data: PrismaPriceVariationMapper.toPrisma(priceVariation),
		});

		return priceVariation;
	}
}
