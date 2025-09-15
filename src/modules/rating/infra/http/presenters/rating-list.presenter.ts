import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { RatingWithUserPresenter } from "./rating-with-user.presenter";

export class RatingListPresenter {
	static present(
		ratings: PaginationResult<Rating & { user: Pick<User, "id" | "name"> }>,
	) {
		return {
			meta: ratings.meta,
			items: ratings.items.map((rating) =>
				RatingWithUserPresenter.present(rating),
			),
		};
	}
}
