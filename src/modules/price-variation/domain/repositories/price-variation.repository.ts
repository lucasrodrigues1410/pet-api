import { PriceVariation } from "../entities/price-variation.entity";

export abstract class PriceVariationRepository {
	abstract getAllByServiceId(serviceId: string): Promise<PriceVariation[]>;
}
