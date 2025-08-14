import {
	Prisma,
	ServicePriceVariation as PrismaServiceVariation,
} from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceVariation, VariationType } from "@/modules/price-variation/domain/entities/price-variation.entity";

export class PrismaPriceVariationMapper {
	static toDomain(
		prismaPriceVariation: PrismaServiceVariation,
	): PriceVariation {
		return PriceVariation.create(
			{
				price: prismaPriceVariation.price.toNumber(),
				value: prismaPriceVariation.value,
				variation: prismaPriceVariation.variation as VariationType,
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
