import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Category } from "src/modules/category/domain/entities/category.entity";
import { Company } from "src/modules/company/domain/entities/company.entity";

export interface ServiceProps {
	name: string;
	description?: string | null;
	price: number;
	isActive: boolean;
	duration?: number | null;
	companyId: UniqueEntityID;
	details?: Record<string, unknown> | null;
	categories?: Category[];
	company?: Company;
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

	get categories() {
		return this.props.categories;
	}

	get company() {
		return this.props.company;
	}

	public static create(props: ServiceProps, id?: UniqueEntityID): Service {
		const service = new Service(props, id);
		return service;
	}
}
