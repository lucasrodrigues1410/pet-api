import { differenceInYears } from "date-fns";
import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface AnimalProps {
	userId: UniqueEntityID;
	breedId: UniqueEntityID;
	name: string;
	age?: number | null;
	weight?: number | null;
	assetId?: UniqueEntityID;
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

	get age() {
		return this.props.age;
	}

	get weight() {
		return this.props.weight;
	}

	get assetId() {
		return this.props.assetId;
	}

	public static create(
		props: Omit<AnimalProps, "age"> & { birthdate?: RawBirthdate },
		id?: UniqueEntityID,
	): Animal {
		return new Animal(
			{
				...props,
				age: props.birthdate
					? differenceInYears(new Date(), new Date(props.birthdate))
					: null,
			},
			id,
		);
	}

	public update(props: Partial<AnimalProps>) {
		this.props = {
			userId: this.userId,
			breedId: this.breedId,
			name: props.name ?? this.name,
			age: props.age ?? this.age,
			weight: props.weight ?? this.weight,
			assetId: props.assetId ?? this.assetId,
		};
		return this;
	}

	public toObject() {
		return {
			id: this.id.toString(),
			userId: this.userId.toString(),
			breedId: this.breedId.toString(),
			name: this.name,
			age: this.age,
			weight: this.weight,
			assetId: this.assetId?.toString(),
		};
	}
}
