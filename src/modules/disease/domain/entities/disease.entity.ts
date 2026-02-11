import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface DiseaseProps {
	name: string;
}

export class Disease extends Entity<DiseaseProps> {
	get name() {
		return this.props.name;
	}

	toPrimitives() {
		return {
			name: this.props.name,
			id: this.id.toValue(),
		};
	}

	public static fromPrimitives(plainData: any) {
		return new Disease(
			{
				name: plainData.name,
			},
			new UniqueEntityID(plainData.id),
		);
	}

	public static create(props: DiseaseProps, id?: UniqueEntityID) {
		return new Disease(props, id);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			name: this.name,
		};
	}
}
