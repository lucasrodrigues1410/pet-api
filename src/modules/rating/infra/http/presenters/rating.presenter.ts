import { Rating } from "@/modules/rating/domain/entities/rating.entity";

export class RatingPresenter {
	static present(rating: Rating) {
		return {
			id: rating.id.toString(),
			companyId: rating.companyId.toString(),
			userId: rating.userId.toString(),
			rating: rating.rating,
			comment: rating.comment,
			createdAt: rating.createdAt.toISOString(),
		};
	}
}
