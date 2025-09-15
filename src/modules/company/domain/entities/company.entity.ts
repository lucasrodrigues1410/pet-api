import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";

export interface CompanyProps {
	name: string;
	contact?: string;
	description?: string;
	logo?: Asset;
	logoAssetId?: UniqueEntityID;
	averageRating?: number;
	ratingCount?: number;
	locationId: UniqueEntityID;
}

export class Company extends Entity<CompanyProps> {
	get name() {
		return this.props.name;
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

	get averageRating() {
		return this.props.averageRating;
	}

	get ratingCount() {
		return this.props.ratingCount;
	}

	get locationId() {
		return this.props.locationId;
	}

	get logoAssetId() {
		return this.props.logoAssetId;
	}

	public static create(props: CompanyProps, id?: UniqueEntityID): Company {
		return new Company(props, id);
	}
}
