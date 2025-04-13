import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface VariationContext {
	type: VariationType;
	value: string | number;
}

export enum VariationType {
	SIZE = "SIZE",
	COAT = "COAT",
	AGE = "AGE",
}

export interface PriceVariationProps {
	serviceId: UniqueEntityID;
	price: number;
	variation: VariationType;
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
