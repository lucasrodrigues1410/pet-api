import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Rating } from "@/modules/rating/domain/entities/rating.entity";

export function makeRating(override: Partial<Rating> = {}) {
    const rating = Rating.create({
        companyId: (override as any).companyId ?? new UniqueEntityID().toString(),
        userId: (override as any).userId ?? new UniqueEntityID().toString(),
        rating: (override as any).rating ?? faker.number.int({ min: 1, max: 5 }),
        comment: (override as any).comment ?? faker.lorem.sentence(),
    });

    return rating;
}


