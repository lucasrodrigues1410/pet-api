import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface PriceVariationProps {
	serviceId: string;
	price: number;
	variation: string;
	value: string;
}

export class PriceVariation extends Entity<PriceVariationProps> {
	get price() {
		return this.props.price;
	}

	get variation() {
		return this.props.variation;
	}

	get value() {
		return this.props.value;
	}

	get serviceId() {
		return this.props.serviceId;
	}

	public static create(
		props: PriceVariationProps,
		id?: UniqueEntityID,
	): PriceVariation {
		return new PriceVariation(props, id);
	}
}
