import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceVariation } from "@/modules/price-variation/domain/entities/price-variation.entity";
import { Category } from "src/modules/category/domain/entities/category.entity";
import { Company } from "src/modules/company/domain/entities/company.entity";

export interface ServiceProps {
	name: string;
	description?: string | null;
	price: number;
	isActive: boolean;
	duration?: number | null;
	capacity?: number;
	companyId: UniqueEntityID;
	details?: Record<string, unknown> | null;
	categories?: Category[];
	company?: Company;
	priceVariations?: PriceVariation[];
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

	get capacity() {
		return this.props.capacity;
	}

	get details() {
		return this.props.details;
	}

	get categories() {
		return this.props.categories;
	}

	get company() {
		return this.props.company;
	}

	get priceVariations() {
		return this.props.priceVariations;
	}

	public static create(props: ServiceProps, id?: UniqueEntityID): Service {
		const service = new Service(props, id);
		return service;
	}
}
