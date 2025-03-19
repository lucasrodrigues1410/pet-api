import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface BreedProps {
	animalTypeId: UniqueEntityID;
	name: string;
}

export class Breed extends Entity<BreedProps> {
	get animalTypeId() {
		return this.props.animalTypeId;
	}

	get name() {
		return this.props.name;
	}

	public static create(props: BreedProps, id?: UniqueEntityID) {
		return new Breed(props, id);
	}
}
