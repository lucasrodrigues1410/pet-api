import { Entity } from "src/core/entities/entity";

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

	public static create(props: CompanyProps, id?: number): Company {
		const company = new Company(props, id);
		return company;
	}
}
