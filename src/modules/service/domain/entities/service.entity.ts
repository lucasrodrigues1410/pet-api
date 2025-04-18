import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Category } from "src/modules/category/domain/entities/category.entity";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { PriceRange } from "./value-objects/price-range.value-object";

export interface ServiceProps {
	name: string;
	description?: string | null;
	price: number;
	isActive: boolean;
	duration?: number | null;
	companyId: UniqueEntityID;
	details?: Record<string, unknown> | null;
	priceRange: PriceRange;
}

export class Service extends Entity<ServiceProps> {
	get name() {
		return this.props.name;
	}

	get description() {
		return this.props.description;
	}

	get price() {
		return this.props.price;
	}

	get isActive() {
		return this.props.isActive;
	}

	get duration() {
		return this.props.duration;
	}

	get companyId() {
		return this.props.companyId;
	}

	get details() {
		return this.props.details;
	}

	get priceRange() {
		return this.props.priceRange;
	}

	public static create(props: ServiceProps, id?: UniqueEntityID): Service {
		const service = new Service(props, id);
		return service;
	}
}

export type ServiceWithRelations = Service & {
	categories: Category[];
	company: Company;
};
