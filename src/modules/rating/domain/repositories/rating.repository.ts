import { Rating } from "../entities/rating.entity";

export abstract class RatingRepository {
    abstract create(rating: Rating): Promise<void>;
}