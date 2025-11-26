import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface AnimalProps {
	userId: UniqueEntityID;
	breedId: UniqueEntityID;
	name: string;
	age?: number | null;
	weight?: number | null;
	assetId?: UniqueEntityID;
	size?: "small" | "medium" | "large" | null;
	ageStage?: "puppy" | "adult" | "senior" | null;
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

	get age() {
		return this.props.age;
	}

	get weight() {
		return this.props.weight;
	}

	get assetId() {
		return this.props.assetId;
	}

	get size() {
		return this.props.size;
	}

	get ageStage() {
		return this.props.ageStage;
	}

	public static create(
		props: Omit<AnimalProps, "size" | "ageStage">,
		id?: UniqueEntityID,
	): Animal {
		const size = props.weight
			? props.weight <= 8
				? "small"
				: props.weight <= 20
					? "medium"
					: "large"
			: "small";
		const ageStage = props.age
			? props.age < 1
				? "puppy"
				: props.age < 10
					? "adult"
					: "senior"
			: "puppy";
		return new Animal({ ...props, size, ageStage }, id);
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
