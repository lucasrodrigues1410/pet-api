import { Entity } from "src/common/entities/entity";

export interface BreedProps {
	animalTypeId: number;
	name: string;
}

export class Breed extends Entity<BreedProps> {
	get animalTypeId(): number {
		return this.props.animalTypeId;
	}

	get name(): string {
		return this.props.name;
	}

	public static create(props: BreedProps, id?: number) {
		return new Breed(props, id);
	}
}
