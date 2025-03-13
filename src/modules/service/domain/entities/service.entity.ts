import { Entity } from "src/core/entities/entity";
import { Category } from "src/modules/category/domain/entities/category.entity";

export interface ServiceProps {
	name: string;
	description?: string | null;
	price: number;
	isActive: boolean;
	duration?: number | null;
	companyId: number;
	details?: Record<string, unknown> | null;
	categories?: Category[];
}

export class Service extends Entity<ServiceProps> {
	get name(): string {
		return this.props.name;
	}

	get description(): string | null | undefined {
		return this.props.description;
	}

	get price(): number {
		return this.props.price;
	}

	get isActive(): boolean {
		return this.props.isActive;
	}

	get duration(): number | null | undefined {
		return this.props.duration;
	}

	get companyId(): number {
		return this.props.companyId;
	}

	get details(): Record<string, unknown> | null | undefined {
		return this.props.details;
	}

	get categories(): Category[] | undefined {
		return this.props.categories;
	}

	public static create(props: ServiceProps, id?: number): Service {
		const service = new Service(props, id);
		return service;
	}
}
