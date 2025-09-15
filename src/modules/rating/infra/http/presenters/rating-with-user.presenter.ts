import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { RatingPresenter } from "./rating.presenter";

export class RatingWithUserPresenter {
	static present(rating: Rating & { user: Pick<User, "id" | "name"> }) {
		return {
			...RatingPresenter.present(rating),
			user: { id: rating.user.id.toString(), name: rating.user.name },
		};
	}
}
