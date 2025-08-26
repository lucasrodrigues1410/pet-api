import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";

export interface CompanyProps {
	name: string;
	address?: string;
	contact?: string;
	description?: string;
	logo?: Asset;
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

	get description() {
		return this.props.description;
	}

	get logo() {
		return this.props.logo;
	}

	public static create(props: CompanyProps, id?: UniqueEntityID): Company {
		return new Company(props, id);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			name: this.name,
			address: this.address,
			contact: this.contact,
			description: this.description,
			logo: this.logo?.toObject(),
		};
	}
}
