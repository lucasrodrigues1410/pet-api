import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

export class InMemoryRatingRepository implements RatingRepository {
    public items: Rating[] = [];
    public shouldThrowNotFound = false;

    async create(rating: Rating): Promise<void> {
        if (this.shouldThrowNotFound) {
            throw new ResourceNotFoundError("Company not found");
        }

        this.items.push(rating);
        await Promise.resolve();
    }
}


