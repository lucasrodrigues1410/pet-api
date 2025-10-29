import { Category } from "src/modules/category/domain/entities/category.entity";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Rules } from "./value-objects/rules.value-object";

export interface ServiceProps {
	name: string;
	description?: string | null;
	price: number;
	isActive: boolean;
	duration: number;
	companyId: UniqueEntityID;
	details?: Record<string, unknown> | null;
	rules?: Rules[];
	rulesPrompt?: string | null;
	requiresPayment: boolean;
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

	get rules() {
		return this.props.rules;
	}

	get rulesPrompt() {
		return this.props.rulesPrompt;
	}

	get requiresPayment() {
		return this.props.requiresPayment;
	}

	public static create(
		{ isActive, ...props }: Omit<ServiceProps, "isActive"> & { isActive?: boolean },
		id?: UniqueEntityID,
	): Service {
		const service = new Service({ ...props, isActive: isActive ?? true }, id);
		return service;
	}
}

export type ServiceWithRelations = Service & {
	categories: Category[];
	company: Company;
};
