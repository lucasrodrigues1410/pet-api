import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

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

	toPrimitives() {
		return {
			animalTypeId: this.props.animalTypeId.toValue(),
			name: this.props.name,
			id: this.id.toValue(),
		};
	}

	public static fromPrimitives(plainData: any) {
		return new Breed(
			{
				animalTypeId: new UniqueEntityID(plainData.animalTypeId),
				name: plainData.name,
			},
			new UniqueEntityID(plainData.id),
		);
	}

	public static create(props: BreedProps, id?: UniqueEntityID) {
		return new Breed(props, id);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			animalTypeId: this.animalTypeId.toString(),
			name: this.name,
		};
	}
}
