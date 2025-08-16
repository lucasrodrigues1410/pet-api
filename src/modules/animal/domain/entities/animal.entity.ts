import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";

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

type RawBirthdate = Date | string | null;

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

	public static create(
		props: Omit<AnimalProps, "birthdate"> & { birthdate?: RawBirthdate },
		id?: UniqueEntityID,
	): Animal {
		return new Animal(
			{
				...props,
				birthdate: props.birthdate ? new Date(props.birthdate) : null,
			},
			id,
		);
	}

	public update(
		props: Partial<
			Omit<AnimalProps, "birthdate"> & { birthdate?: RawBirthdate }
		>,
	) {
		this.props = {
			userId: this.userId,
			breedId: this.breedId,
			name: props.name ?? this.name,
			birthdate: props.birthdate ? new Date(props.birthdate) : this.birthdate,
			weight: props.weight ?? this.weight,
			breed: props.breed ?? this.breed,
			assetId: props.assetId ?? this.assetId,
			asset: props.asset ?? this.asset,
		};
		return this;
	}

}
