import { PriceVariation } from "@/modules/price-variation/domain/entities/price-variation.entity";
import { PriceVariationRepository } from "@/modules/price-variation/domain/repositories/price-variation.repository";

export class InMemoryPriceVariationRepository
	implements PriceVariationRepository
{
	public items: PriceVariation[] = [];

	findByServiceId(serviceId: string): Promise<PriceVariation[]> {
		const priceVariations = this.items.filter(
			(priceVariation) => priceVariation.serviceId.toString() === serviceId,
		);
		return Promise.resolve(priceVariations);
	}
}
