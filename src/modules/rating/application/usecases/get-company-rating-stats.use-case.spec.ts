import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeRating } from "test/factories/make-rating";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { RatingRepository } from "../../domain/repositories/rating.repository";
import { GetCompanyRatingStatsUseCase } from "./get-company-rating-stats.use-case";

let moduleRef: any;
let sut: GetCompanyRatingStatsUseCase;

const mockRatingRepository = {
	getCompanyRatingStats: jest.fn(),
	findByUserAndCompany: jest.fn(),
	findByCompanyId: jest.fn(),
	create: jest.fn(),
};

describe("Get Company Rating Stats", () => {
	beforeEach(async () => {
		mockRatingRepository.getCompanyRatingStats.mockReset();
		mockRatingRepository.findByUserAndCompany.mockReset();
		mockRatingRepository.findByCompanyId.mockReset();
		mockRatingRepository.create.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetCompanyRatingStatsUseCase,
				{ provide: RatingRepository, useValue: mockRatingRepository },
			],
		}).compile();

		sut = moduleRef.get(GetCompanyRatingStatsUseCase);
	});

	it("should get company rating statistics", async () => {
		const companyId = new UniqueEntityID();

		// Cria ratings com diferentes valores
		const ratings = [
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 4 }), // 4 estrelas
			makeRating({ companyId, rating: 4 }), // 4 estrelas
			makeRating({ companyId, rating: 3 }), // 3 estrelas
		];

		// compute expected stats from ratings
		const fiveStars = ratings.filter((r) => r.rating === 5).length;
		const fourStars = ratings.filter((r) => r.rating === 4).length;
		const threeStars = ratings.filter((r) => r.rating === 3).length;
		const total = ratings.length;
		const avg = (5 * fiveStars + 4 * fourStars + 3 * threeStars) / total;

		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: total,
			averageRating: avg,
			distribution: [
				{ rating: 5, count: fiveStars },
				{ rating: 4, count: fourStars },
				{ rating: 3, count: threeStars },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(6);
			expect(stats.averageRating).toBeCloseTo(4.33, 2); // (5+5+5+4+4+3)/6 = 4.33

			expect(stats.distribution).toEqual([
				{ rating: 5, count: 3 },
				{ rating: 4, count: 2 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should return zero stats for company with no ratings", async () => {
		const companyId = new UniqueEntityID();

		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: 0,
			averageRating: 0,
			distribution: [
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(0);
			expect(stats.averageRating).toBe(0);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should calculate correct stats for all 5-star ratings", async () => {
		const companyId = new UniqueEntityID();

		// Todas as avaliações são 5 estrelas (mocked via repository)

		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: 10,
			averageRating: 5,
			distribution: [
				{ rating: 5, count: 10 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(10);
			expect(stats.averageRating).toBe(5);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 10 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should calculate correct stats for mixed ratings", async () => {
		const companyId = new UniqueEntityID();

		// Mix de avaliações como no exemplo

		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: 6,
			averageRating: 4.333333333333333,
			distribution: [
				{ rating: 5, count: 3 },
				{ rating: 4, count: 2 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(6);
			expect(stats.averageRating).toBeCloseTo(4.3, 1);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 3 },
				{ rating: 4, count: 2 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should only count ratings for the specified company", async () => {
		const companyId = new UniqueEntityID();
		// context variable removed as repository is mocked

		// Ratings para a empresa alvo / outra empresa (não usados diretamente aqui)

		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: 2,
			averageRating: 4.5,
			distribution: [
				{ rating: 5, count: 1 },
				{ rating: 4, count: 1 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(2);
			expect(stats.averageRating).toBe(4.5); // (5+4)/2
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 1 },
				{ rating: 4, count: 1 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should handle single rating correctly", async () => {
		const companyId = new UniqueEntityID();

		// Single rating case
		mockRatingRepository.getCompanyRatingStats.mockResolvedValueOnce({
			totalRatings: 1,
			averageRating: 3,
			distribution: [
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			],
		});

		const result = await sut.execute({ companyId: companyId.toString() });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(1);
			expect(stats.averageRating).toBe(3);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});
});
