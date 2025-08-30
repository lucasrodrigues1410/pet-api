import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Rating, RatingProps } from "@/modules/rating/domain/entities/rating.entity";

export function makeRating(override: Partial<RatingProps & { id?: UniqueEntityID }> = {}) {
    const rating = Rating.create({
        companyId: override.companyId ?? new UniqueEntityID(),
        userId: override.userId ?? new UniqueEntityID(),
        rating: override.rating ?? faker.number.int({ min: 1, max: 5 }),
        comment: override.comment ?? faker.lorem.sentence(),
        createdAt: override.createdAt ?? faker.date.recent(),
    }, override.id);

    return rating;
}


