import { Asset } from "@/modules/asset/domain/entities/asset";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";

export interface AnimalProps {
	userId: UniqueEntityID;
	breedId: UniqueEntityID;
	name: string;
	birthdate?: Date | null;
	weight?: number | null;
	breed?: Breed | undefined | null;
	assetId?: UniqueEntityID;
	asset?: Asset;
}

export class Animal extends Entity<AnimalProps> {
	get userId() {
		return this.props.userId;
	}

	get breedId() {
		return this.props.breedId;
	}

	get name() {
		return this.props.name;
	}

	get birthdate() {
		return this.props.birthdate;
	}

	get weight() {
		return this.props.weight;
	}

	get breed() {
		return this.props.breed;
	}

	get assetId() {
		return this.props.assetId;
	}

	get asset() {
		return this.props.asset;
	}

	public static create(props: AnimalProps, id?: UniqueEntityID): Animal {
		return new Animal(props, id);
	}
}
