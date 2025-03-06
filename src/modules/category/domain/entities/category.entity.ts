import { Entity } from "src/common/entities/entity";

export type CategoryType = "PETSHOP";

export class CategoryProps {
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

	public static create(props: CategoryProps, id?: number): Category {
		const category = new Category(props, id);
		return category;
	}
}
