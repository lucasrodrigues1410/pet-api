import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface CompanyProps {
	name: string;
	address?: string;
	contact?: string;
}

export class Company extends Entity<CompanyProps> {
	get name() {
		return this.props.name;
	}

	get address() {
		return this.props.address;
	}

	get contact() {
		return this.props.contact;
	}

	public static create(props: CompanyProps, id?: UniqueEntityID): Company {
		return new Company(props, id);
	}
}
