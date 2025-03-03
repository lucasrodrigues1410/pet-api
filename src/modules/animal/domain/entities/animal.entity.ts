import { Entity } from "src/common/entities/entity";

export interface AnimalProps {
	userId: number;
	breedId: number;
	name: string;
	birthdate?: Date | null;
	weight?: number | null;
}

export class Animal extends Entity<AnimalProps> {
	get userId(): number {
		return this.props.userId;
	}

	get breedId(): number {
		return this.props.breedId;
	}

	get name(): string {
		return this.props.name;
	}

	get birthdate(): Date | null | undefined {
		return this.props.birthdate;
	}

	get weight(): number | null | undefined {
		return this.props.weight;
	}

	private constructor(props: AnimalProps, id?: number) {
		super(props, id);
	}

	public static create(props: AnimalProps, id?: number): Animal {
		return new Animal(props, id);
	}
}
