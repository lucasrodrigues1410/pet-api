import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export type CategoryType = "PETSHOP";

export interface CategoryProps {
	name: string;
	type: CategoryType;
	description?: string | null;
}

export class Category extends Entity<CategoryProps> {
	get name(): string {
		return this.props.name;
	}

	get type(): CategoryType {
		return this.props.type;
	}

	get description(): string | null | undefined {
		return this.props.description;
	}

	public static create(props: CategoryProps, id?: UniqueEntityID): Category {
		return new Category(props, id);
	}
}
