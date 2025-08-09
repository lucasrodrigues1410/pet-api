import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceVariation } from "@/modules/price-variation/domain/entities/price-variation.entity";
import {
	Prisma,
	ServicePriceVariation as PrismaServiceVariation,
} from "@/prisma-generated/client";

export class PrismaPriceVariationMapper {
	static toDomain(
		prismaPriceVariation: PrismaServiceVariation,
	): PriceVariation {
		return PriceVariation.create(
			{
				price: prismaPriceVariation.price.toNumber(),
				value: prismaPriceVariation.value,
				variation: prismaPriceVariation.variation,
				serviceId: new UniqueEntityID(prismaPriceVariation.serviceId),
			},
			new UniqueEntityID(prismaPriceVariation.id),
		);
	}

	static toPrisma(
		priceVariation: PriceVariation,
	): Prisma.ServicePriceVariationUncheckedCreateInput {
		return {
			id: priceVariation.id.toString(),
			serviceId: priceVariation.serviceId.toString(),
			price: priceVariation.price,
			value: priceVariation.value,
			variation: priceVariation.variation,
		};
	}
}
