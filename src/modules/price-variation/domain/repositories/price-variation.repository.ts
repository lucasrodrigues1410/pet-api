import { PriceVariation } from "../entities/price-variation.entity";

export abstract class PriceVariationRepository {
	abstract findByServiceId(serviceId: string): Promise<PriceVariation[]>;
}
