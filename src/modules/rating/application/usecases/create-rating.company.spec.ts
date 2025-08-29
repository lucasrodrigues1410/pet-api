import { beforeEach, describe, expect, it } from "bun:test";
import { makeRating } from "test/factories/make-rating";
import { InMemoryRatingRepository } from "test/repositories/in-memory-rating.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CreateRatingCompanyUseCase } from "./create-rating.company";

let inMemoryRatingRepository: InMemoryRatingRepository;
let sut: CreateRatingCompanyUseCase;

describe("Create company rating", () => {
	beforeEach(() => {
		inMemoryRatingRepository = new InMemoryRatingRepository();
		sut = new CreateRatingCompanyUseCase(inMemoryRatingRepository as any);
	});

	it("should create a rating for a company", async () => {
		const rating = makeRating();

		const result = await sut.execute({
			companyId: rating.companyId,
			userId: rating.userId,
			rating: rating.rating,
			comment: rating.comment,
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryRatingRepository.items).toHaveLength(1);
		expect(inMemoryRatingRepository.items[0]).toMatchObject({
			rating: rating.rating,
			comment: rating.comment,
		});
	});

	it("should return ResourceNotFoundError if company does not exist", async () => {
		inMemoryRatingRepository.shouldThrowNotFound = true;

		const result = await sut.execute({
			companyId: "non-existent",
			userId: "any-user",
			rating: 5,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
