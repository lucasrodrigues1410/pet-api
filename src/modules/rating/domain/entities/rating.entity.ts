import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface RatingProps {
	companyId: UniqueEntityID;
	userId: UniqueEntityID;
	rating: number;
	comment?: string;
	createdAt: Date;
}

export class Rating extends Entity<RatingProps> {
	get companyId() {
		return this.props.companyId;
	}

	get userId() {
		return this.props.userId;
	}

	get rating() {
		return this.props.rating;
	}

	get comment() {
		return this.props.comment;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	public static create(
		props: Omit<RatingProps, "createdAt"> & { createdAt?: Date },
		id?: UniqueEntityID,
	): Rating {
		return new Rating(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			companyId: this.companyId.toString(),
			userId: this.userId.toString(),
			rating: this.rating,
			comment: this.comment,
			createdAt: this.createdAt.toISOString(),
		};
	}
}
