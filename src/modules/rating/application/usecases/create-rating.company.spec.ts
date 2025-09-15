import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeRating } from "test/factories/make-rating";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { RatingRepository } from "../../domain/repositories/rating.repository";
import { CreateRatingCompanyUseCase } from "./create-rating.company";

let moduleRef: any;
let sut: CreateRatingCompanyUseCase;

const mockRatingRepository = { create: jest.fn() };

describe("Create company rating", () => {
	beforeEach(async () => {
		mockRatingRepository.create.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateRatingCompanyUseCase,
				{ provide: RatingRepository, useValue: mockRatingRepository },
			],
		}).compile();

		sut = moduleRef.get(CreateRatingCompanyUseCase);
	});

	it("should create a rating for a company", async () => {
		const rating = makeRating();

		const result = await sut.execute({
			companyId: rating.companyId.toString(),
			userId: rating.userId.toString(),
			rating: rating.rating,
			comment: rating.comment,
		});

		expect(result.isRight()).toBe(true);
		expect(mockRatingRepository.create).toHaveBeenCalled();
	});

	it("should return ResourceNotFoundError if company does not exist", async () => {
		mockRatingRepository.create.mockRejectedValueOnce(
			new ResourceNotFoundError("Company not found"),
		);

		const result = await sut.execute({
			companyId: "non-existent",
			userId: "any-user",
			rating: 5,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
